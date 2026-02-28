/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `idl.json`.
 */
export type MedverifyProgram = {
  "address": "CAz5m1avkahj9Mud1qyH1HW7xjAV3wWxfFa3UrjdFWvh";
  "metadata": {
    "name": "medverifyProgram";
    "version": "0.1.0";
    "spec": "0.1.0";
    "description": "Created with Anchor";
  };
  "instructions": [
    {
      "name": "registerDoctor";
      "discriminator": [189, 164, 237, 143, 138, 160, 251, 115];
      "accounts": [
        {
          "name": "doctorRecord";
          "writable": true;
          "pda": {
            "seeds": [
              {
                "kind": "const";
                "value": [100, 111, 99, 116, 111, 114];
              },
              {
                "kind": "arg";
                "path": "licenseNumber";
              }
            ];
          };
        },
        {
          "name": "authority";
          "writable": true;
          "signer": true;
        },
        {
          "name": "systemProgram";
          "address": "11111111111111111111111111111111";
        }
      ];
      "args": [
        {
          "name": "licenseNumber";
          "type": "string";
        },
        {
          "name": "name";
          "type": "string";
        },
        {
          "name": "specialization";
          "type": "string";
        },
        {
          "name": "council";
          "type": "string";
        },
        {
          "name": "registeredSince";
          "type": "string";
        },
        {
          "name": "expiryDate";
          "type": "string";
        },
        {
          "name": "clinic";
          "type": "string";
        },
        {
          "name": "phone";
          "type": "string";
        }
      ];
    },
    {
      "name": "revokeDoctor";
      "discriminator": [100, 88, 146, 123, 73, 190, 203, 89];
      "accounts": [
        {
          "name": "doctorRecord";
          "writable": true;
          "pda": {
            "seeds": [
              {
                "kind": "const";
                "value": [100, 111, 99, 116, 111, 114];
              },
              {
                "kind": "account";
                "path": "doctorRecord.licenseNumber";
              }
            ];
          };
        },
        {
          "name": "authority";
          "signer": true;
        }
      ];
      "args": [];
    }
  ];
  "accounts": [
    {
      "name": "doctorRecord";
      "discriminator": [86, 126, 242, 66, 227, 81, 230, 109];
    }
  ];
  "errors": [
    {
      "code": 6000;
      "name": "licenseTooLong";
      "msg": "License number must be 32 characters or fewer";
    },
    {
      "code": 6001;
      "name": "nameTooLong";
      "msg": "Name must be 64 characters or fewer";
    },
    {
      "code": 6002;
      "name": "alreadyRevoked";
      "msg": "Doctor is already revoked";
    }
  ];
  "types": [
    {
      "name": "doctorRecord";
      "type": {
        "kind": "struct";
        "fields": [
          {
            "name": "licenseNumber";
            "type": "string";
          },
          {
            "name": "name";
            "type": "string";
          },
          {
            "name": "specialization";
            "type": "string";
          },
          {
            "name": "council";
            "type": "string";
          },
          {
            "name": "registeredSince";
            "type": "string";
          },
          {
            "name": "expiryDate";
            "type": "string";
          },
          {
            "name": "clinic";
            "type": "string";
          },
          {
            "name": "phone";
            "type": "string";
          },
          {
            "name": "registered";
            "type": "bool";
          },
          {
            "name": "authority";
            "type": "pubkey";
          },
          {
            "name": "lastUpdated";
            "type": "i64";
          }
        ];
      };
    }
  ];
};
