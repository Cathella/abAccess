CREATE POLICY "Users can update own packages" ON user_packages
    FOR UPDATE USING (true);
