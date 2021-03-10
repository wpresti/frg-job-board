window.onload = onLoad

function scrollToTop() {
  console.log("SCROLL TO TOP CLICKED!!!!!!!!!!!!!!!!!!!!!!!");
  //document.getElementById("topDiv").scrollIntoView();
  setTimeout(() => {
    document.getElementById("topDiv").scrollIntoView({
      behavior: "smooth"
    });
  }, 150);
}







//hacky workaround but it works!
$("#accordion").on("click", function() {
  $(".list-group-item").each(function(index) { //list-group-item	
    $(this).removeClass("active show");
  });
});







function onLoad() {
  console.log("onLoad()");
  axios.get("https://boards-api.greenhouse.io/v1/boards/frgjobs/departments?render_as=tree")
    .then((response) => {
      //console.log(response);
      //console.log(response.data.departments);
      let departments = response.data.departments;
      //departments = testJson.departments; // test json data
      departments.forEach(eachDep);
    });

}

function eachDep(value, index, array) {


  //for loop to check for jobs in subDeps, if there are no jobs -- continue

  let isJobsAvail = false;
  let i;
  for (i = 0; i < value.children.length; i++) {
    console.log("_+_+", value.children[i])
    if (value.children[i].jobs.length > 0) {
      isJobsAvail = true
    }
  }
  if (isJobsAvail == false) {
    return;
  }

  // end check


  let depName = value.name;
  let depID = value.id;
  //create and append card and its children to accordion div
  let card = document.createElement("div");
  card.setAttribute("class", "card");


  let cardHeader = document.createElement("div");
  cardHeader.setAttribute("class", "card-header");
  cardHeader.setAttribute("id", depID + "Heading");
  cardHeader.setAttribute("style", "background-color: #fff;")

  let h2 = document.createElement("h2");
  h2.setAttribute("class", "mb-0");

  let button = document.createElement("button");
  button.setAttribute("class", "btn"); //btn-link
  button.setAttribute("disabled", "disabled") // newly added
  button.setAttribute("type", "button");
  //button.setAttribute("data-toggle", "collapse");
  button.setAttribute("data-target", "#collapse" + depID);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "collapse" + depID);
  button.setAttribute("style", "font-size : 20px; font-weight: bold; background-color: #fff; color: #000000;");
  button.innerHTML = depName;

  //append
  h2.appendChild(button);
  cardHeader.appendChild(h2);
  card.appendChild(cardHeader);
  document.getElementById("accordion").appendChild(card);

  //append below stuff to card
  let collapseDiv = document.createElement("div");
  collapseDiv.setAttribute("id", "collapse" + depID);
  collapseDiv.setAttribute("class", "collapse show"); //show
  collapseDiv.setAttribute("aira-labelledby", depID + "Heading");
  collapseDiv.setAttribute("data-parent", "#accordion");

  let cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  let listGroup = document.createElement("div");
  listGroup.setAttribute("class", "list-group");
  listGroup.setAttribute("id", "list-tab-" + depID) // may potentially be a problem if i want to reference this later
  listGroup.setAttribute("role", "tablist")

  //console.log("children: ", value.children)
  let subDep = value.children;
  let x;
  for (x in subDep) {
    //console.log("subDep: ", subDep[x]);
    let dep = subDep[x];
    if (dep.jobs.length == 0) {
      continue;
    }
    let aClass = document.createElement("a"); //a
    // console.log("1")
    aClass.setAttribute("class", "list-group-item list-group-item-action d-flex justify-content-between align-items-center");
    aClass.setAttribute("id", "list-" + dep.id + "-list");
    //console.log("1")
    aClass.setAttribute("data-toggle", "list");
    aClass.setAttribute("href", "#list-" + dep.id);
    aClass.setAttribute("role", "tab");
    //console.log("1")
    //console.log("2")
    aClass.setAttribute("aria-controls", dep.id) // may need to change later
    //console.log("1")
    aClass.innerHTML = dep.name;
    aClass.setAttribute("onclick", "scrollToTop()");
    aClass.setAttribute("style", "font-size : 18px; color: #000000;");


    //create num badge and append to aClass
    let spanBadge = document.createElement("span");
    spanBadge.setAttribute("class", "badge badge-primary badge-pill badge-warning");
    spanBadge.innerHTML = dep.jobs.length
    spanBadge.setAttribute("style","margin-left: 7px;");
    aClass.appendChild(spanBadge)


    listGroup.appendChild(aClass);
    //console.log('done')
    //console.log("-=-=-=sub dep jobs-=-=-=-=", subDep[x].jobs)
    if (subDep[x].jobs.length > 0) {
      appendJobs(subDep[x].jobs, dep.id);
    }
  }
  cardBody.appendChild(listGroup);
  collapseDiv.appendChild(cardBody);


  card.appendChild(collapseDiv);

  //append to accordion???
  //document.getElementById("accordion").appendChild(card)

  //console.log("______________+++++++__________________")

}

function appendJobs(jobList, depID) {
  //console.log(" in appendJobs()", "depID:", depID);
  //console.log("_+_+_+jobList:", jobList);
  //console.log("length of jobList", jobList.length)

  //make this a for loop


  let tabContent = document.getElementById("nav-tabContent");

  let tabPane = document.createElement("div");
  tabPane.setAttribute("class", "tab-pane fade");
  tabPane.setAttribute("id", "list-" + depID);
  tabPane.setAttribute("role", "tabpanel");
  tabPane.setAttribute("aria-labelledby", "list-" + depID + "-list");


  let listGroup = document.createElement("div");
  listGroup.setAttribute("class", "list-group");
  listGroup.setAttribute("id", "list-" + depID + "-group");
  tabPane.appendChild(listGroup)
  tabContent.appendChild(tabPane)



  let i;
  for (i = 0; i < jobList.length; i++) {
    //console.log("I:", i);
    let aTag = document.createElement("a");
    aTag.setAttribute("href", jobList[i].absolute_url);
    aTag.setAttribute("class", "list-group-item list-group-item-action");
    aTag.innerHTML = jobList[i].title;
    //aTag.setAttribute("onclick","scrollToTop()");
    aTag.setAttribute("target", "_blank");
    aTag.setAttribute("style", "font-size: 18px; color: #000000;");
    //console.log("%$%", jobList[i].title)

    let aSpan = document.createElement("span");
    aSpan.innerHTML = jobList[i].location.name;
    aSpan.setAttribute("style", "display: block; float: right; color: #929292;") //#808080
    aTag.appendChild(aSpan)


    listGroup.appendChild(aTag);


  }

}

