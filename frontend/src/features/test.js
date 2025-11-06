const token = "ghp_xxxxx";

const query = `
  query {
    repository(owner: "boostcampwm-snu-2025", name: "bye2money") {
      pullRequests(states: OPEN, first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
        nodes {
          number
          title
          url
          createdAt
          author {
            login
            url
          }
        }
      }
    }
  }
`;

fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ query }),
})
  .then(res => res.json())
  .then(data => {
    console.log("📦 열린 PR 목록:", data.data.repository.pullRequests.nodes);
  })
  .catch(console.error);