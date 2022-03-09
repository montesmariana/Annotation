async function getUsers() {
  const response = await fetch("users.json");
  return await response.json();
}

function initUser(user) {
  Swal.fire({
    title: "Login succesful!",
    html: "Welcome, " + user,
    icon: "success",
  });
  text["user"] = user;
  if (
    typeof Storage !== "undefined" &&
    JSON.parse(localStorage.getItem("annotations-" + text["user"])) != null
  ) {
    text = JSON.parse(localStorage.getItem("annotations-" + text["user"]));
  }
  saved = JSON.stringify(text);
}
async function loadJsons() {
  let inout = await d3.json("inoutconcept.json");
  inout = inout === null ? "" : inout;
  return {
    category1: await d3.json("senses.json"),
    category2: inout,
    messages: await d3.json("messages.json"),
  };
}
async function findConcordance(concepts) {
  const concordances = {};
  if (typeof concepts === "object") {
    concepts.forEach(async function (concept) {
      concordances[concept] = await d3.tsv(`concordances/${concept}.tsv`);
    });
  } else {
    concordances[concepts] = await d3.tsv(`concordances/${concepts}.tsv`);
  }
  return concordances;
}
async function loadData() {
  const user_mappings = await getUsers();
  const { value: user } = await Swal.fire({
    title: "Welcome",
    text: "Please enter your username",
    input: "text",
    inputPlaceholder: "name",
    inputValidator: (value) => {
      if (d3.keys(user_mappings).indexOf(value) === -1) {
        return "Wrong username, please try again.";
      }
    },
  });
  initUser(user);
  const concepts = user_mappings[user];
  const concordance = await findConcordance(concepts);
  const { category1, category2, messages } = await loadJsons();
  execute(concordance, category1, category2, messages);
}
