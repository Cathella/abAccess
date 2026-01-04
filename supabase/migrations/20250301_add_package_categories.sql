DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'package_category'
      AND e.enumlabel = 'lab_tests'
  ) THEN
    ALTER TYPE package_category ADD VALUE 'lab_tests';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'package_category'
      AND e.enumlabel = 'pharmacy'
  ) THEN
    ALTER TYPE package_category ADD VALUE 'pharmacy';
  END IF;
END $$;
