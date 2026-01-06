create unique index if not exists packages_unique_signature
on packages (name, category, price, visit_count, validity_days, copay);
