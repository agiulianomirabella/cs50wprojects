document.addEventListener('DOMContentLoaded', function() {

    const profileSection = document.querySelector("#profile-section")
    const editReportButton = document.querySelector("#edit-report-button")
    const editReportSubmit = document.querySelector("#edit-report-submit")
    const editReportSection = document.querySelector('#edit-report-section')
    const editReportText = document.querySelector("#edit-report-text")
    const reportSection = document.querySelector('#report')

    // GET report
    fetch('report')
    .then(response => response.json())
    .then(report => {
        reportSection.innerHTML = report.report
    })

    editReportButton.onclick = () => {

        fetch('report')
        .then(response => response.json())
        .then(report => {
            editReportText.innerHTML = report.report
        })

        reportSection.style.display='none'
        editReportSection.style.display = 'block'
        editReportButton.style.display = 'none'
    }

    editReportSubmit.onclick = () => {

        // PUT report
        fetch('report', {
            method: 'PUT',
            body: JSON.stringify({
                'edit-report-text': editReportText.value 
            })
        })
        .then(response => response.json())
        .then(report => {
            console.log(report.report)
            reportSection.innerHTML = report.report
        })

        reportSection.style.display='block'
        editReportSection.style.display = 'none'
        editReportButton.style.display = 'block'
    }

    

})