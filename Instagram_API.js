let username = "USERNAME";
let followers = [],
  followings = [];
try {
  let res = await fetch(`https://www.instagram.com/${username}/?__a=1`);

  res = await res.json();
  let userId = res.graphql.user.id;

  let after = null,
    has_next = true;
  while (has_next) {
    await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
        encodeURIComponent(
          JSON.stringify({
            id: userId,
            include_reel: true,
            fetch_mutual: true,
            first: 50,
            after: after,
          })
        )
    )
      .then((res) => res.json())
      .then((res) => {
        has_next = res.data.user.edge_followed_by.page_info.has_next_page;
        after = res.data.user.edge_followed_by.page_info.end_cursor;
        followers = followers.concat(
          res.data.user.edge_followed_by.edges.map(({ node }) => {
            return {
              username: node.username,
              full_name: node.full_name,
              is_verified: node.is_verified,
            };
          })
        );
      });
  }
//   console.log("Followers", followers);

  has_next = true;
  after = null;
  while (has_next) {
    await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
        encodeURIComponent(
          JSON.stringify({
            id: userId,
            include_reel: true,
            fetch_mutual: true,
            first: 50,
            after: after,
          })
        )
    )
      .then((res) => res.json())
      .then((res) => {
        has_next = res.data.user.edge_follow.page_info.has_next_page;
        after = res.data.user.edge_follow.page_info.end_cursor;
        followings = followings.concat(
          res.data.user.edge_follow.edges.map(({ node }) => {
            return {
              username: node.username,
              full_name: node.full_name,
              is_verified: node.is_verified,
            };
          })
        );
      });
  }

//   console.log("Followings", followings);
} catch (err) {
  console.log("Invalid username");
}

let x, y, followsYou, youFollows, accountYouFollowButTheyDont=[], accountTheyFollowButYouDont=[], verifiedAccountYouFollow=[], verifiedAccountFollowYou=[];
for(x = 0; x < followings.length; x++) {
  if(followings[x].is_verified) {
    verifiedAccountYouFollow.push(followings[x].username);
  }
  followsYou = false;
  for(y = 0; y < followers.length; y++) {
    if(followings[x].username === followers[y].username) {
      followsYou = true;
      break;
    }
  }
  if(followsYou === false) {
    accountYouFollowButTheyDont.push(followings[x].username); 
  }
}
for(x = 0; x < followers.length; x++) {
  if(followers[x].is_verified) {
    verifiedAccountFollowYou.push(followers[x].username);
  }
  youFollows = false;
  for(y = 0; y < followings.length; y++) {
    if(followings[y].username === followers[x].username) {
      youFollows = true;
      break;
    }
  }
  if(youFollows === false) {
    accountTheyFollowButYouDont.push(followers[x].username);
  }
}
console.log("Account You Follow But they Don't: ");
console.log(accountYouFollowButTheyDont);
console.log("Account They follow but you don't: ");
console.log(accountTheyFollowButYouDont);
console.log("Verified Accounts you follow: ");
console.log(verifiedAccountYouFollow);
console.log("Verified Accounts that follows you: ");
console.log(verifiedAccountFollowYou);
