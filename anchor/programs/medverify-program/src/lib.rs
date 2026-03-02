use anchor_lang::prelude::*;

declare_id!("BaYoL7uwvc7VfPJnG6LEY3DHLb5PSq1c2YwzVNLmKjRq"); // Program ID - will be updated after build

#[program]
pub mod medverify_program {
    use super::*;

    /// Called once by an admin to register a doctor on-chain.
    pub fn register_doctor(
        ctx: Context<RegisterDoctor>,
        license_number: String,
        name: String,
        specialization: String,
        council: String,
        registered_since: String,
        expiry_date: String,
        clinic: String,
        phone: String,
    ) -> Result<()> {
        require!(license_number.len() <= 32, MedError::LicenseTooLong);
        require!(name.len() <= 64, MedError::NameTooLong);

        let record = &mut ctx.accounts.doctor_record;
        record.license_number = license_number;
        record.name = name;
        record.specialization = specialization;
        record.council = council;
        record.registered_since = registered_since;
        record.expiry_date = expiry_date;
        record.clinic = clinic;
        record.phone = phone;
        record.registered = true;
        record.authority = ctx.accounts.authority.key();
        record.last_updated = Clock::get()?.unix_timestamp;

        msg!("Doctor registered: {}", record.license_number);
        Ok(())
    }

    /// Revoke a doctor's registration (admin only).
    pub fn revoke_doctor(ctx: Context<RevokeDoctor>) -> Result<()> {
        let record = &mut ctx.accounts.doctor_record;
        require!(record.registered, MedError::AlreadyRevoked);
        record.registered = false;
        record.last_updated = Clock::get()?.unix_timestamp;
        msg!("Doctor revoked: {}", record.license_number);
        Ok(())
    }
}

// ── Accounts ──────────────────────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(license_number: String)]
pub struct RegisterDoctor<'info> {
    #[account(
        init,
        payer = authority,
        space = DoctorRecord::SIZE,
        seeds = [b"doctor", license_number.as_bytes()],
        bump
    )]
    pub doctor_record: Account<'info, DoctorRecord>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeDoctor<'info> {
    #[account(
        mut,
        has_one = authority,
        seeds = [b"doctor", doctor_record.license_number.as_bytes()],
        bump
    )]
    pub doctor_record: Account<'info, DoctorRecord>,

    pub authority: Signer<'info>,
}

// ── State ─────────────────────────────────────────────────────────────────────

#[account]
pub struct DoctorRecord {
    pub license_number: String,   // max 32
    pub name: String,             // max 64
    pub specialization: String,   // max 64
    pub council: String,          // max 64
    pub registered_since: String, // max 16  (ISO date "YYYY-MM-DD")
    pub expiry_date: String,      // max 16
    pub clinic: String,           // max 64
    pub phone: String,            // max 20
    pub registered: bool,
    pub authority: Pubkey,
    pub last_updated: i64,
}

impl DoctorRecord {
    // 8 (discriminator)
    // + 4+32 + 4+64 + 4+64 + 4+64 + 4+16 + 4+16 + 4+64 + 4+20
    // + 1 (bool) + 32 (pubkey) + 8 (i64)
    pub const SIZE: usize = 8 + (4+32) + (4+64)*5 + (4+16)*2 + (4+20) + 1 + 32 + 8;
}

// ── Errors ────────────────────────────────────────────────────────────────────

#[error_code]
pub enum MedError {
    #[msg("License number must be 32 characters or fewer")]
    LicenseTooLong,
    #[msg("Name must be 64 characters or fewer")]
    NameTooLong,
    #[msg("Doctor is already revoked")]
    AlreadyRevoked,
}
