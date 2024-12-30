document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("courses-search-form");
    const searchInput = document.getElementById("courses-search-input");
    const recommendations = document.getElementById("courses-recommendations");

    async function performSearch() {
        const query = searchInput.value.trim();
        if (query === "") {
            recommendations.innerHTML = "";
            return;
        }
        try {
            const response = await fetch("/admin/search/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
            if (response.ok) {
                const courses = await response.json();
                displayRecommendations(courses);
            } else {
                console.error("Error fetching data");
            }
        } catch (err) {
            console.error(err);
        }
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        performSearch();
    });

    searchInput.addEventListener("input", performSearch);

    function displayRecommendations(courses) {
        recommendations.innerHTML = courses.length === 0 ? "No results found." : "";
        courses.forEach((course) => {
            const li = document.createElement("li");
            li.className = "rcmn-li";
            li.textContent = course.course_name;
            li.setAttribute("data-id", course.course_id);
            recommendations.appendChild(li);
        });
    }

    function navigateToUser(courseId) {
        window.location.href = `/admin/courses/${courseId}`;
    }

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && recommendations.firstElementChild) {
            const courseId = recommendations.firstElementChild.getAttribute("data-id");
            window.location.href = `/admin/courses/${courseId}`;
        }
    });
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (recommendations.firstElementChild) {
            const courseId = recommendations.firstElementChild.getAttribute("data-id");
            window.location.href = `/admin/courses/${courseId}`;
        }
    });
    recommendations.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            const courseId = e.target.getAttribute("data-id");
            window.location.href = `/admin/courses/${courseId}`;
        }
    });
});


