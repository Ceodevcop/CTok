function submitProject() {
    let projectSummary = document.getElementById("project-summary").value;
    let documentFile = document.getElementById("project-document").files[0];

    if (projectSummary && documentFile) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let projectData = {
                summary: projectSummary,
                document: event.target.result,
                status: "Pending"
            };

            let projects = JSON.parse(localStorage.getItem("pendingProjects")) || [];
            projects.push(projectData);
            localStorage.setItem("pendingProjects", JSON.stringify(projects));

            alert("Project submitted successfully!");
        };
        reader.readAsDataURL(documentFile);
    } else {
        alert("Please enter a project summary and upload a document.");
    }
}
