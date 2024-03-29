import Cron from 'cron';
const CronJob = Cron.CronJob;
// import IDL from './../program/idl.js'
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
const auth_keypair = JSON.parse(process.env.KEYPAIR);
const AUTH_WALLET = Keypair.fromSecretKey(new Uint8Array(auth_keypair));
const connection = new Connection("https://multi-compatible-dream.solana-mainnet.quiknode.pro/ab10715a148f3ffb855f7e7665821f318f1c2cb8/");
const donor = new Wallet(AUTH_WALLET);
const PROGRAM_ID = "4p78LV6o9gdZ6YJ3yABSbp3mVq9xXa4NqheXTB1fa4LJ";
const provider = new AnchorProvider(connection, donor, { commitment: "confirmed"});
const IDL = {
    "version": "0.1.0",
    "name": "bonk_paws",
    "instructions": [
      {
        "name": "donate",
        "accounts": [
          {
            "name": "donor",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "charity",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "donationState",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "donation_state"
                }
              ]
            }
          },
          {
            "name": "matchDonationState",
            "isMut": true,
            "isSigner": false,
            "isOptional": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "match_donation"
                },
                {
                  "kind": "arg",
                  "type": "u64",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "instructions",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "seeds",
            "type": "u64"
          },
          {
            "name": "solDonation",
            "type": "u64"
          }
        ]
      },
      {
        "name": "matchDonation",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "charity",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "bonk",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "authorityBonk",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "wsol",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "authorityWsol",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "donationState",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "donation_state"
                }
              ]
            }
          },
          {
            "name": "matchDonationState",
            "isMut": true,
            "isSigner": false,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "type": "string",
                  "value": "match_donation"
                },
                {
                  "kind": "account",
                  "type": "u64",
                  "account": "MatchDonationState",
                  "path": "match_donation_state.seed"
                }
              ]
            }
          },
          {
            "name": "instructions",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "bonkDonation",
            "type": "u64"
          }
        ]
      },
      {
        "name": "finalizeDonation",
        "accounts": [
          {
            "name": "donor",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "charity",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "wsol",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "donorWsol",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "instructions",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "DonationState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bonkBurned",
              "type": "u64"
            },
            {
              "name": "bonkDonated",
              "type": "u64"
            },
            {
              "name": "bonkMatched",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "matchDonationState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "u64"
            },
            {
              "name": "donationAmount",
              "type": "u64"
            },
            {
              "name": "matchKey",
              "type": "publicKey"
            },
            {
              "name": "seed",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "SharedAccountsRoute",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "id",
              "type": "u8"
            },
            {
              "name": "routePlan",
              "type": {
                "vec": {
                  "defined": "RoutePlanStep"
                }
              }
            },
            {
              "name": "inAmount",
              "type": "u64"
            },
            {
              "name": "quotedOutAmount",
              "type": "u64"
            },
            {
              "name": "slippageBps",
              "type": "u16"
            },
            {
              "name": "platformFeeBps",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "RoutePlanStep",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "swap",
              "type": {
                "defined": "Swap"
              }
            },
            {
              "name": "percent",
              "type": "u8"
            },
            {
              "name": "inputIndex",
              "type": "u8"
            },
            {
              "name": "outputIndex",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "Side",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Bid"
            },
            {
              "name": "Ask"
            }
          ]
        }
      },
      {
        "name": "Swap",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Saber"
            },
            {
              "name": "SaberAddDecimalsDeposit"
            },
            {
              "name": "SaberAddDecimalsWithdraw"
            },
            {
              "name": "TokenSwap"
            },
            {
              "name": "Sencha"
            },
            {
              "name": "Step"
            },
            {
              "name": "Cropper"
            },
            {
              "name": "Raydium"
            },
            {
              "name": "Crema",
              "fields": [
                {
                  "name": "xToY",
                  "type": "bool"
                }
              ]
            },
            {
              "name": "Lifinity"
            },
            {
              "name": "Mercurial"
            },
            {
              "name": "Cykura"
            },
            {
              "name": "Serum",
              "fields": [
                {
                  "name": "side",
                  "type": {
                    "defined": "Side"
                  }
                }
              ]
            },
            {
              "name": "MarinadeDeposit"
            },
            {
              "name": "MarinadeUnstake"
            },
            {
              "name": "Aldrin",
              "fields": [
                {
                  "name": "side",
                  "type": {
                    "defined": "Side"
                  }
                }
              ]
            },
            {
              "name": "AldrinV2",
              "fields": [
                {
                  "name": "side",
                  "type": {
                    "defined": "Side"
                  }
                }
              ]
            },
            {
              "name": "Whirlpool",
              "fields": [
                {
                  "name": "aToB",
                  "type": "bool"
                }
              ]
            },
            {
              "name": "Invariant",
              "fields": [
                {
                  "name": "xToY",
                  "type": "bool"
                }
              ]
            },
            {
              "name": "Meteora"
            },
            {
              "name": "GooseFX"
            },
            {
              "name": "DeltaFi",
              "fields": [
                {
                  "name": "stable",
                  "type": "bool"
                }
              ]
            },
            {
              "name": "Balansol"
            },
            {
              "name": "MarcoPolo",
              "fields": [
                {
                  "name": "xToY",
                  "type": "bool"
                }
              ]
            },
            {
              "name": "Dradex",
              "fields": [
                {
                  "name": "side",
                  "type": {
                    "defined": "Side"
                  }
                }
              ]
            },
            {
              "name": "LifinityV2"
            },
            {
              "name": "RaydiumClmm"
            },
            {
              "name": "Openbook",
              "fields": [
                {
                  "name": "side",
                  "type": {
                    "defined": "Side"
                  }
                }
              ]
            },
            {
              "name": "Phoenix",
              "fields": [
                {
                  "name": "side",
                  "type": {
                    "defined": "Side"
                  }
                }
              ]
            },
            {
              "name": "Symmetry",
              "fields": [
                {
                  "name": "fromTokenId",
                  "type": "u64"
                },
                {
                  "name": "toTokenId",
                  "type": "u64"
                }
              ]
            },
            {
              "name": "TokenSwapV2"
            },
            {
              "name": "HeliumTreasuryManagementRedeemV0"
            },
            {
              "name": "StakeDexStakeWrappedSol"
            },
            {
              "name": "StakeDexSwapViaStake",
              "fields": [
                {
                  "name": "bridgeStakeSeed",
                  "type": "u32"
                }
              ]
            },
            {
              "name": "GooseFXV2"
            },
            {
              "name": "Perps"
            },
            {
              "name": "PerpsAddLiquidity"
            },
            {
              "name": "PerpsRemoveLiquidity"
            },
            {
              "name": "MeteoraDlmm"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Overflow",
        "msg": "Overflow"
      },
      {
        "code": 6001,
        "name": "InvalidAmount",
        "msg": "Invalid amount"
      },
      {
        "code": 6002,
        "name": "MissingSwapIx",
        "msg": "Swap IX not found"
      },
      {
        "code": 6003,
        "name": "MissingFinalizeIx",
        "msg": "Finalize IX not found"
      },
      {
        "code": 6004,
        "name": "MissingDonateIx",
        "msg": "Donate IX not found"
      },
      {
        "code": 6005,
        "name": "ProgramMismatch",
        "msg": "Invalid Program ID"
      },
      {
        "code": 6006,
        "name": "InvalidInstruction",
        "msg": "Invalid instruction"
      },
      {
        "code": 6007,
        "name": "InvalidRoute",
        "msg": "Invalid number of routes"
      },
      {
        "code": 6008,
        "name": "InvalidSlippage",
        "msg": "Invalid slippage"
      },
      {
        "code": 6009,
        "name": "InvalidSolanaAmount",
        "msg": "Invalid Solana amount"
      },
      {
        "code": 6010,
        "name": "InvalidBonkMint",
        "msg": "Invalid BONK mint address"
      },
      {
        "code": 6011,
        "name": "InvalidBonkAccount",
        "msg": "Invalid BONK account"
      },
      {
        "code": 6012,
        "name": "InvalidBonkATA",
        "msg": "Invalid BONK ATA"
      },
      {
        "code": 6013,
        "name": "InvalidwSolMint",
        "msg": "Invalid wSOL mint address"
      },
      {
        "code": 6014,
        "name": "InvalidwSolATA",
        "msg": "Invalid wSOL ATA"
      },
      {
        "code": 6015,
        "name": "InvalidwSolAccount",
        "msg": "Invalid wSOL account"
      },
      {
        "code": 6016,
        "name": "InvalidwSolBalance",
        "msg": "Invalid wSOL balance"
      },
      {
        "code": 6017,
        "name": "InvalidCharityAddress",
        "msg": "Invalid charity address"
      },
      {
        "code": 6018,
        "name": "InvalidCharityId",
        "msg": "Invalid charity Id"
      },
      {
        "code": 6019,
        "name": "InvalidLamportsBalance",
        "msg": "Invalid lamports balance"
      },
      {
        "code": 6020,
        "name": "InvalidInstructionIndex",
        "msg": "Invalid instruction index"
      },
      {
        "code": 6021,
        "name": "SignatureHeaderMismatch",
        "msg": "Signature header mismatch"
      },
      {
        "code": 6022,
        "name": "SignatureAuthorityMismatch",
        "msg": "Signature authority mismatch"
      },
      {
        "code": 6023,
        "name": "NotMatchingDonation",
        "msg": "Not enough SOL Donated to Match"
      },
      {
        "code": 6024,
        "name": "InvalidMatchKey",
        "msg": "Invalid Match Key"
      }
    ]
}
const program = new Program(IDL, PROGRAM_ID, provider);

const delay = (ms) => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
});





const match_finalise = async () => {
    const allMatchDonationState = await program.account.matchDonationState.all();
    console.log(allMatchDonationState.length);
    console.log(allMatchDonationState[3]);
    for(const matchDonationState of allMatchDonationState){
        const fromAmount = parseInt(matchDonationState.account.donationAmount.toString())/LAMPORTS_PER_SOL;
        const charityWallet2 = matchDonationState.account.matchKey.toBase58();
        const matchDonationStatepub = matchDonationState.publicKey.toBase58();
        delay(3000);
        const data = {
          fromAmount:fromAmount,
          charityWallet2:charityWallet2,
          matchDonationState:matchDonationStatepub
      }
        const postoptions = {
            method: 'POST',
            url: "http://localhost:3000/api/matchFinaliseIx",
            headers: {'Content-Type': 'application/json'},
            data: data
        };
        console.log(data);
        const res = (await axios.request(postoptions));
        console.log(await res.json());
        
    }


}
match_finalise()

// cron schedule (every 1 hour)
const cronSchedule = '0 */6 * * *';

// Create the cron job
const job = new CronJob(cronSchedule, async function() {
  console.log('updating the stored animal realted charity list...');
  await match_finalise();
});

// Start the cron job
job.start();

console.log(`Cron job scheduled with "${cronSchedule}"`);

