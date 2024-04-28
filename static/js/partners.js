document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form3");
    const searchInput = document.getElementById("search-input3");
    const recommendations = document.getElementById("recommendations3");

    async function performSearch() {
        const query = searchInput.value.trim();
        if (query === "") {
            recommendations.innerHTML = "";
            return;
        }
        try {
            const response = await fetch("/search/partners", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
            if (response.ok) {
                const users = await response.json();
                displayRecommendations(users);
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

    function displayRecommendations(users) {
        recommendations.innerHTML = users.length === 0 ? "No results found." : "";
        users.forEach((user) => {
            const li = document.createElement("li");
            li.className = "rcmn-li";
            li.textContent = user.name;
            li.setAttribute("data-id", user.id);
            recommendations.appendChild(li);
        });
    }

    function navigateToUser(userId) {
        window.location.href = `/editpartners/${userId}`;
    }

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && recommendations.firstElementChild) {
            const userId = recommendations.firstElementChild.getAttribute("data-id");
            window.location.href = `/editpartners/${userId}`;
        }
    });
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (recommendations.firstElementChild) {
            const userId = recommendations.firstElementChild.getAttribute("data-id");
            window.location.href = `/editpartners/${userId}`;
        }
    });
    recommendations.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            const userId = e.target.getAttribute("data-id");
            window.location.href = `/editpartners/${userId}`;
        }
    });
});