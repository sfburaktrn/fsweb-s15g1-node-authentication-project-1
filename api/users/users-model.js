const db = require("../../data/db-config");

/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
async function bul() {
  const allUsers = await db("users");

  const allUsersResponse = allUsers.map((item) => {
    return { user_id: item.user_id, username: item.username };
  });
  return allUsersResponse;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  let filteredUsers = await db("users").where(filtre);
  return filteredUsers;
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  const result = await db("users").where("user_id", user_id).first();
  return { username: result.username, user_id: result.user_id };
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  let inserted = await db("users").insert(user);
  return idyeGoreBul(inserted[0]);
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  idyeGoreBul,
  ekle,
  goreBul,
  bul,
};
