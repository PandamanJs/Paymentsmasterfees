/**
 * Supabase Production Configuration
 * Row Level Security (RLS) policies and production setup
 */

export const SUPABASE_PRODUCTION_SETUP = {
  // Required RLS Policies
  RLS_POLICIES: [
    {
      table: 'transactions',
      policy: 'Users can only view their own transactions',
      sql: `
        CREATE POLICY "Users can view own transactions" ON transactions
        FOR SELECT USING (user_phone = auth.jwt() ->> 'phone');
        
        CREATE POLICY "Users can insert own transactions" ON transactions
        FOR INSERT WITH CHECK (user_phone = auth.jwt() ->> 'phone');
      `
    },
    {
      table: 'students',
      policy: 'Parents can only view their own students',
      sql: `
        CREATE POLICY "Parents can view own students" ON students
        FOR SELECT USING (parent_phone = auth.jwt() ->> 'phone');
      `
    },
    {
      table: 'payment_history',
      policy: 'Users can only access their payment history',
      sql: `
        CREATE POLICY "Users can view own payment history" ON payment_history
        FOR SELECT USING (user_phone = auth.jwt() ->> 'phone');
      `
    }
  ],

  // Database Functions
  REQUIRED_FUNCTIONS: [
    {
      name: 'process_payment',
      description: 'Secure payment processing function',
      sql: `
        CREATE OR REPLACE FUNCTION process_payment(
          p_user_phone TEXT,
          p_amount DECIMAL,
          p_services JSONB,
          p_payment_method TEXT
        ) RETURNS JSONB AS $$
        DECLARE
          transaction_id TEXT;
          result JSONB;
        BEGIN
          -- Generate secure transaction ID
          transaction_id := 'TXN_' || extract(epoch from now()) || '_' || gen_random_uuid();
          
          -- Insert transaction record
          INSERT INTO transactions (
            id, user_phone, amount, services, status, created_at
          ) VALUES (
            transaction_id, p_user_phone, p_amount, p_services, 'pending', now()
          );
          
          -- Return transaction details
          result := jsonb_build_object(
            'transaction_id', transaction_id,
            'status', 'pending',
            'amount', p_amount
          );
          
          RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }
  ],

  // Required Tables
  PRODUCTION_SCHEMA: `
    -- Enable RLS
    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE students ENABLE ROW LEVEL SECURITY;
    ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
    
    -- Add indexes for performance
    CREATE INDEX IF NOT EXISTS idx_transactions_user_phone ON transactions(user_phone);
    CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
    CREATE INDEX IF NOT EXISTS idx_students_parent_phone ON students(parent_phone);
    CREATE INDEX IF NOT EXISTS idx_payment_history_user_phone ON payment_history(user_phone);
    CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);
  `
};

/**
 * Production Environment Validation
 */
export const validateProductionEnvironment = () => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VITE_PAYMENT_GATEWAY_URL',
    'PAYMENT_AUTH_ID'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
};
