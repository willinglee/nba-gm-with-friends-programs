use anchor_lang::prelude::*;

declare_id!("BKYnkCDDTEzYez4YhmgJsbFNPK6TWQL1uanVKsxFfzPA");

#[program]
pub mod nba_gm_with_friends_programs {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        base_account.total_players = 0;

        Ok(())
    }

    pub fn add_player(ctx: Context<AddPlayer>, name: String) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        let item = ItemStruct {
            name: name.to_string(),
            user_address: *base_account.to_account_info().key,
        };

        base_account.player_list.push(item);
        base_account.total_players += 1;

        Ok(())
    }
}

// Attach variables to the Initialize Context
#[derive(Accounts)]
pub struct Initialize<'info> {
    // Initialize account
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddPlayer<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
}

// Tell Solana what we want to store on the account
#[account]
pub struct BaseAccount {
    pub total_players: u64,
    pub player_list: Vec<ItemStruct>,
}

// Create a custom struct
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub name: String,
    pub user_address: Pubkey,
}
