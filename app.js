/**
 * BlackwellArchitecture Portfolio Application Script
 * Classic Steam 2010 profile features, live ticker, custom tabs, status picker, and comments system.
 */

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------------------------
    // 1. LIVE JOINED TICKER
    // --------------------------------------------------------------------------
    // Target Joined Date: June 15, 2026 2:43 PM GMT+8
    // UTC representation: June 15, 2026 6:43:00 AM (14:43 - 8 hours = 6:43)
    const joinDate = new Date(Date.UTC(2026, 5, 15, 6, 43, 0));
    const tickerEl = document.getElementById("joined_seconds_ticker");

    function updateTicker() {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - joinDate.getTime()) / 1000);

        if (tickerEl) {
            if (diffInSeconds < 0) {
                // In case user's local clock is set prior to June 15, 2026
                tickerEl.textContent = `Joined June 15, 2026 2:43 PM GMT+8`;
            } else {
                tickerEl.textContent = `Joined ${diffInSeconds.toLocaleString()} seconds ago`;
            }
        }
    }

    // Run immediately and then update every second
    updateTicker();
    setInterval(updateTicker, 1000);

    // --------------------------------------------------------------------------
    // 2. TAB NAVIGATION
    // --------------------------------------------------------------------------
    const tabLinks = document.querySelectorAll(".tab_link");
    const tabPanes = document.querySelectorAll(".tab_pane");

    tabLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetTab = link.getAttribute("data-tab");

            // Update tab button styles
            tabLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // Show corresponding pane
            tabPanes.forEach(pane => {
                pane.classList.remove("active");
                if (pane.id === `pane_${targetTab}`) {
                    pane.classList.add("active");
                }
            });
        });
    });

    // --------------------------------------------------------------------------
    // 3. STATS STATUS PICKER (Interactive Easter Egg)
    // --------------------------------------------------------------------------
    // Allows toggling user status by clicking the Online tag or Avatar border
    const onlineTag = document.querySelector(".online_tag");
    const avatarBorder = document.querySelector(".avatar_status_border");
    const statusWidget = document.querySelector(".status_widget");
    const statusWidgetTitle = statusWidget ? statusWidget.querySelector("h3") : null;
    const gameStatusText = document.querySelector(".game_status");
    const gameDetailsText = document.querySelector(".game_details");

    const statuses = [
        {
            name: "Online",
            class: "online",
            borderStyle: "linear-gradient(to bottom, #97c230, #5c8715)",
            borderRaw: "1px solid #3d5b0c",
            widgetTitle: "Currently Online",
            gameStatus: "Vibecoding",
            gameDetails: "Slop LLC - IDE v2026.7",
            tagColor: "#82b224",
            tagBg: "rgba(130, 178, 36, 0.15)"
        },
        {
            name: "Away",
            class: "away",
            borderStyle: "linear-gradient(to bottom, #7296b8, #3b5a78)",
            borderRaw: "1px solid #283e54",
            widgetTitle: "Currently Away",
            gameStatus: "AFK (Grabbing Coffee)",
            gameDetails: "Last active 15m ago",
            tagColor: "#57a8e8",
            tagBg: "rgba(87, 168, 232, 0.15)"
        },
        {
            name: "Busy",
            class: "busy",
            borderStyle: "linear-gradient(to bottom, #d9534f, #a94442)",
            borderRaw: "1px solid #761c19",
            widgetTitle: "Do Not Disturb",
            gameStatus: "Compiling Large Project",
            gameDetails: "Compile script running...",
            tagColor: "#d9534f",
            tagBg: "rgba(217, 83, 79, 0.15)"
        }
    ];

    let currentStatusIndex = 0;

    function toggleStatus() {
        currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
        const current = statuses[currentStatusIndex];

        // Update tag
        if (onlineTag) {
            onlineTag.textContent = current.name;
            onlineTag.style.color = current.tagColor;
            onlineTag.style.borderColor = current.tagColor;
            onlineTag.style.backgroundColor = current.tagBg;
            onlineTag.style.textShadow = `0 0 5px ${current.tagColor}4c`;
        }

        // Update avatar border background and border color
        if (avatarBorder) {
            avatarBorder.style.background = current.borderStyle;
            avatarBorder.style.border = current.borderRaw;
        }

        // Update sidebar status card
        if (statusWidget) {
            statusWidget.style.borderLeftColor = current.tagColor;
        }
        if (statusWidgetTitle) {
            statusWidgetTitle.textContent = current.widgetTitle;
        }
        if (gameStatusText) {
            gameStatusText.textContent = current.gameStatus;
            gameStatusText.style.color = current.tagColor;
            gameStatusText.style.textShadow = `0 0 4px ${current.tagColor}4c`;
        }
        if (gameDetailsText) {
            gameDetailsText.textContent = current.gameDetails;
        }
    }

    if (onlineTag) {
        onlineTag.style.cursor = "pointer";
        onlineTag.title = "Click to change status";
        onlineTag.addEventListener("click", toggleStatus);
    }
    if (avatarBorder) {
        avatarBorder.style.cursor = "pointer";
        avatarBorder.title = "Click to change status";
        avatarBorder.addEventListener("click", toggleStatus);
    }

    // --------------------------------------------------------------------------
    // 4. INTERACTIVE COMMENT SECTION
    // --------------------------------------------------------------------------
    const commentCountEl = document.getElementById("comment_count");
    const commentTextarea = document.getElementById("comment_textarea");
    const postCommentBtn = document.getElementById("btn_post_comment");
    const commentsContainer = document.getElementById("comments_container");

    // Classic Steam default avatar SVG string (grey background, question mark inside)
    const defaultAvatarSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="%23303842"/><text x="50%" y="60%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="%2366c0f4" dominant-baseline="middle" text-anchor="middle">?</text></svg>`;

    // Default mock comments for empty state
    const defaultComments = [
        {
            id: 1,
            author: "GamerPro_2010",
            avatar: defaultAvatarSvg,
            text: "vibe levels are off the chart here. awesome profile layout, brings back memories of 1.6 clan forums!",
            date: "Jul 1, 2026 @ 3:24pm",
            isDeletable: false
        },
        {
            id: 2,
            author: "SlopArchitect",
            avatar: defaultAvatarSvg,
            text: "Nice contributions outside of github. Archiving archive.org is based. +rep clean code",
            date: "Jul 2, 2026 @ 10:14am",
            isDeletable: false
        }
    ];

    // Load comments from localStorage or initialize with defaults
    function getComments() {
        const stored = localStorage.getItem("steam_comments");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error parsing stored comments:", e);
                return defaultComments;
            }
        }
        return defaultComments;
    }

    function saveComments(comments) {
        localStorage.setItem("steam_comments", JSON.stringify(comments));
    }

    function formatDate(date) {
        // Format: "Jul 2, 2026 @ 6:08pm"
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const m = months[date.getMonth()];
        const d = date.getDate();
        const y = date.getFullYear();
        
        let hrs = date.getHours();
        const mins = String(date.getMinutes()).padStart(2, "0");
        const ampm = hrs >= 12 ? "pm" : "am";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // 0 should be 12

        return `${m} ${d}, ${y} @ ${hrs}:${mins}${ampm}`;
    }

    function renderComments() {
        const comments = getComments();
        
        // Update count
        if (commentCountEl) {
            commentCountEl.textContent = comments.length;
        }

        if (comments.length === 0) {
            commentsContainer.innerHTML = `<div class="no_comments_placeholder">No comments yet. Be the first to write a comment!</div>`;
            return;
        }

        commentsContainer.innerHTML = "";
        
        // Render from newest to oldest
        comments.slice().reverse().forEach(comment => {
            const commentNode = document.createElement("div");
            commentNode.className = "comment_node";
            commentNode.dataset.id = comment.id;

            commentNode.innerHTML = `
                <div class="comment_author_avatar">
                    <img src="${comment.avatar}" alt="${comment.author} Avatar">
                </div>
                <div class="comment_content_wrapper">
                    <div class="comment_meta">
                        <span class="comment_author_name">${comment.author}</span>
                        <div>
                            <span class="comment_date">${comment.date}</span>
                            ${comment.isDeletable !== false ? `<button class="btn_delete_comment" data-id="${comment.id}" title="Delete comment">×</button>` : ""}
                        </div>
                    </div>
                    <div class="comment_text">${escapeHtml(comment.text)}</div>
                </div>
            `;

            commentsContainer.appendChild(commentNode);
        });

        // Add event listeners for delete buttons
        const deleteButtons = commentsContainer.querySelectorAll(".btn_delete_comment");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const commentId = parseInt(e.target.getAttribute("data-id"));
                deleteComment(commentId);
            });
        });
    }

    function addComment(text) {
        const comments = getComments();
        const newComment = {
            id: Date.now(),
            author: "Visitor_Vibecoder",
            avatar: defaultAvatarSvg,
            text: text,
            date: formatDate(new Date()),
            isDeletable: true
        };

        comments.push(newComment);
        saveComments(comments);
        renderComments();
    }

    function deleteComment(id) {
        let comments = getComments();
        comments = comments.filter(c => c.id !== id);
        saveComments(comments);
        renderComments();
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    if (postCommentBtn) {
        postCommentBtn.addEventListener("click", () => {
            const text = commentTextarea.value.trim();
            if (text) {
                addComment(text);
                commentTextarea.value = "";
            }
        });
    }

    // Allow Ctrl+Enter to submit comment
    if (commentTextarea) {
        commentTextarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                postCommentBtn.click();
            }
        });
    }

    // Initial load of comments
    renderComments();
});
