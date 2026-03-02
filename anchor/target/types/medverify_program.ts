/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/medverify_program.json`.
 */
export type MedverifyProgram = {
  "address": "BaYoL7uwvc7VfPJnG6LEY3DHLb5PSq1c2YwzVNLmKjRq",
  "metadata": {
    "name": "medverifyProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "registerDoctor",
      "docs": [
        "Called once by an admin to register a doctor on-chain."
      ],
      "discriminator": [
        181,
        67,
        216,
        215,
        132,
        240,
        147,
        125
      ],
      "accounts": [
        {
          "name": "doctorRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  99,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "licenseNumber"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "licenseNumber",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "specialization",
          "type": "string"
        },
        {
          "name": "council",
          "type": "string"
        },
        {
          "name": "registeredSince",
          "type": "string"
        },
        {
          "name": "expiryDate",
          "type": "string"
        },
        {
          "name": "clinic",
          "type": "string"
        },
        {
          "name": "phone",
          "type": "string"
        }
      ]
    },
    {
      "name": "revokeDoctor",
      "docs": [
        "Revoke a doctor's registration (admin only)."
      ],
      "discriminator": [
        4,
        85,
        201,
        220,
        151,
        175,
        32,
        40
      ],
      "accounts": [
        {
          "name": "doctorRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  99,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "doctor_record.license_number",
                "account": "doctorRecord"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "doctorRecord"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "doctorRecord",
      "discriminator": [
        234,
        218,
        23,
        78,
        235,
        198,
        219,
        219
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "licenseTooLong",
      "msg": "License number must be 32 characters or fewer"
    },
    {
      "code": 6001,
      "name": "nameTooLong",
      "msg": "Name must be 64 characters or fewer"
    },
    {
      "code": 6002,
      "name": "alreadyRevoked",
      "msg": "Doctor is already revoked"
    }
  ],
  "types": [
    {
      "name": "doctorRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "licenseNumber",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "specialization",
            "type": "string"
          },
          {
            "name": "council",
            "type": "string"
          },
          {
            "name": "registeredSince",
            "type": "string"
          },
          {
            "name": "expiryDate",
            "type": "string"
          },
          {
            "name": "clinic",
            "type": "string"
          },
          {
            "name": "phone",
            "type": "string"
          },
          {
            "name": "registered",
            "type": "bool"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
