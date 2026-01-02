/**
 * Network Queue - Handles retry logic for failed operations
 *
 * When operations fail due to network issues, they are queued and retried
 * up to MAX_RETRIES times. This ensures data consistency even with poor connectivity.
 */

import * as walletService from '../services/walletService';
import * as paymentMethodService from '../services/paymentMethodService';

const MAX_RETRIES = 3;
const QUEUE_STORAGE_KEY = 'network-queue';

export interface QueuedOperation {
  id: string;
  type: 'addTransaction' | 'updateBalance' | 'addPaymentMethod' | 'removePaymentMethod';
  data: any;
  timestamp: string;
  retries: number;
}

class NetworkQueue {
  private queue: QueuedOperation[] = [];
  private maxRetries: number = MAX_RETRIES;
  private isProcessing: boolean = false;

  constructor() {
    this.loadQueue();
  }

  /**
   * Add operation to queue
   */
  add(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>): void {
    const queuedOp: QueuedOperation = {
      id: crypto.randomUUID(),
      ...operation,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    this.queue.push(queuedOp);
    this.saveQueue();
  }

  /**
   * Process all queued operations
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    if (this.queue.length === 0) return;

    this.isProcessing = true;

    const operationsToProcess = [...this.queue];

    for (const operation of operationsToProcess) {
      try {
        const success = await this.executeOperation(operation);

        if (success) {
          // Remove from queue on success
          this.removeFromQueue(operation.id);
        } else {
          // Increment retry count
          operation.retries++;

          if (operation.retries >= this.maxRetries) {
            console.error('Operation failed after max retries:', operation);
            this.removeFromQueue(operation.id);
          }
        }
      } catch (error) {
        console.error('Error processing queued operation:', error);
        operation.retries++;

        if (operation.retries >= this.maxRetries) {
          this.removeFromQueue(operation.id);
        }
      }
    }

    this.saveQueue();
    this.isProcessing = false;
  }

  /**
   * Execute a queued operation
   */
  private async executeOperation(operation: QueuedOperation): Promise<boolean> {
    switch (operation.type) {
      case 'addTransaction':
        const txResult = await walletService.addTransaction(operation.data);
        return txResult.success;

      case 'updateBalance':
        const balanceResult = await walletService.updateWalletBalance(
          operation.data.walletId,
          operation.data.balance
        );
        return balanceResult.success;

      case 'addPaymentMethod':
        const addResult = await paymentMethodService.addPaymentMethod(operation.data);
        return addResult.success;

      case 'removePaymentMethod':
        const removeResult = await paymentMethodService.removePaymentMethod(
          operation.data.paymentMethodId
        );
        return removeResult.success;

      default:
        console.error('Unknown operation type:', operation.type);
        return false;
    }
  }

  /**
   * Remove operation from queue
   */
  private removeFromQueue(operationId: string): void {
    this.queue = this.queue.filter((op) => op.id !== operationId);
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      }
    } catch (error) {
      console.error('Failed to save network queue:', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
        if (stored) {
          this.queue = JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error('Failed to load network queue:', error);
      this.queue = [];
    }
  }

  /**
   * Get current queue length
   */
  get length(): number {
    return this.queue.length;
  }

  /**
   * Clear all queued operations
   */
  clear(): void {
    this.queue = [];
    this.saveQueue();
  }
}

// Export singleton instance
export const networkQueue = new NetworkQueue();

// Auto-process queue on app load
if (typeof window !== 'undefined') {
  // Process queue when online
  window.addEventListener('online', () => {
    console.log('Network restored, processing queued operations...');
    networkQueue.processQueue();
  });
}
