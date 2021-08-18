import { PoolClient } from "pg";

import { snapshotSafe, withRootDb } from "../../helpers";

async function linkOrRegisterUser(
  client: PoolClient,
  userId: string | null,
  service: string | null,
  identifier: string | null,
  profile: { [key: string]: any } | null,
  authDetails: { [key: string]: any } | null
) {
  const {
    rows: [row],
  } = await client.query(
    `select * from app_private.link_or_register_user($1, $2, $3, $4, $5)`,
    [
      userId,
      service,
      identifier,
      profile ? JSON.stringify(profile) : null,
      authDetails ? JSON.stringify(authDetails) : null,
    ]
  );
  return row;
}

it("login with new oauth sharing email of existing account links accounts", () =>
  withRootDb(async (client) => {
    const sharedEmail = "existing@example.com";
    const existingUser = await linkOrRegisterUser(
      client,
      null,
      "github",
      "123456",
      {
        email: sharedEmail,
      },
      {}
    );
    expect(existingUser).toBeTruthy();
    const linkedUser = await linkOrRegisterUser(
      client,
      null,
      "twitter",
      "654321",
      {
        email: sharedEmail,
      },
      {}
    );
    expect(linkedUser).toBeTruthy();
    expect(existingUser.id).toEqual(linkedUser.id);
  }));

it("login with new oauth when logged in links accounts", () =>
  withRootDb(async (client) => {
    const githubUser = await linkOrRegisterUser(
      client,
      null,
      "github",
      "123456",
      {
        email: "github@example.com",
      },
      {}
    );
    expect(githubUser).toBeTruthy();
    const twitterUser = await linkOrRegisterUser(
      client,
      githubUser.id,
      "twitter",
      "654321",
      {
        email: "twitter@example.com",
      },
      {}
    );
    expect(twitterUser).toBeTruthy();
    expect(twitterUser.id).toEqual(githubUser.id);
  }));
