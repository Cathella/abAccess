export function RewardCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-center font-semibold text-gray-900 mb-3">
        Your reward
      </h3>
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E8F4F1] rounded-full flex items-center justify-center">
            <span className="text-2xl">🎉</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">+1 bonus visit</p>
            <p className="text-sm text-gray-500">Added to a package of your choice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
