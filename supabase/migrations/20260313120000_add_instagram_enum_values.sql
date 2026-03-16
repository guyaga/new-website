-- Add 'instagram' value to portfolio_type and media_type enums
ALTER TYPE portfolio_type ADD VALUE IF NOT EXISTS 'instagram';
ALTER TYPE media_type ADD VALUE IF NOT EXISTS 'instagram';
