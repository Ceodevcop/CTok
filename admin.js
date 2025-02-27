let pendingProjects = JSON.parse(localStorage.getItem("pendingProjects")) || [];

function loadProjects() {
    let projectList = document.getElementById("project-list");
    projectList.innerHTML = "";
    
    pendingProjects.forEach((project, index) => {
        let projectDiv = document.createElement("div");
        projectDiv.innerHTML = `
            <p><strong>Project:</strong> ${project.summary}</p>
            <button onclick="approveProject(${index})">Approve</button>
            <button onclick="rejectProject(${index})">Reject</button>
            <hr>
        `;
        projectList.appendChild(projectDiv);
    });
}

function approveProject(index) {
    pendingProjects[index].status = "Approved";
    updateProjects();
}

function rejectProject(index) {
    pendingProjects[index].status = "Rejected";
    updateProjects();
}

function updateProjects() {
    localStorage.setItem("pendingProjects", JSON.stringify(pendingProjects));
    loadProjects();
}

window.onload = loadProjects;
