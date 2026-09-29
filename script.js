/* =========================================
   PAGE RANK GAME
   ========================================= */


/* ---------- GAME NAVIGATION ---------- */

let currentLevel = 0;

const levelIds = [
    "intro",
    "level1",
    "level2",
    "level3",
    "level4",
    "level5",
    "level6",
    "level7"
];


function goTo(id) {

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    const index = levelIds.indexOf(id);

    currentLevel = index;

    document.getElementById("levelNumber").textContent =
        Math.min(index, 7);

    document.getElementById("progressBar").style.width =
        ((index / 7) * 100) + "%";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function startGame() {
    goTo("level1");
}


/* =========================================
   LEVEL 1
   WORD COUNT
   ========================================= */

function wordChoice(choice) {

    const feedback = document.getElementById("wordFeedback");

    if (choice === "A") {

        feedback.innerHTML =
            "🤔 It has more words, but that doesn't prove it is more useful.";

    } else {

        feedback.innerHTML =
            "💡 Interesting! Counting words alone isn't enough to decide importance.";

    }

    setTimeout(() => {

        feedback.innerHTML +=
            "<br><br><strong>PageRank asks a different question: who links to this page?</strong>";

        setTimeout(() => {
            goTo("level2");
        }, 2200);

    }, 1200);
}


/* =========================================
   LEVEL 2
   LINKS
   ========================================= */

function voteChoice(choice) {

    const feedback = document.getElementById("voteFeedback");

    if (choice === "important") {

        feedback.innerHTML =
            "⭐ Exactly! PageRank considers the link structure of the web.";

    } else {

        feedback.innerHTML =
            "Not quite. A link from an important page can carry more importance.";

    }

    setTimeout(() => {
        goTo("level3");
    }, 2500);
}


/* =========================================
   LEVEL 3
   RANDOM SURFER
   ========================================= */

let surferVisits = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
};

const surferLinks = {
    A: ["B", "C"],
    B: ["A", "D"],
    C: ["A"],
    D: ["C"]
};

let currentSurferPage = "A";
let surferRunning = false;


function startSurfer() {

    if (surferRunning) return;

    surferRunning = true;

    surferVisits = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };

    currentSurferPage = "A";

    runSurferStep(0);
}


function runSurferStep(step) {

    if (step >= 12) {

        surferRunning = false;

        document.getElementById("surferStatus").textContent =
            "Surfing complete!";

        document.getElementById("surferMessage").textContent =
            "Look at which pages received the most visits.";

        document.getElementById("surferReveal")
            .classList.remove("hidden");

        document.getElementById("surferContinue")
            .classList.remove("hidden");

        return;
    }


    surferVisits[currentSurferPage]++;

    updateSurferDisplay();

    highlightSurferPage(currentSurferPage);


    setTimeout(() => {

        const links = surferLinks[currentSurferPage];

        const next =
            links[Math.floor(Math.random() * links.length)];

        currentSurferPage = next;

        runSurferStep(step + 1);

    }, 700);
}


function highlightSurferPage(page) {

    document.querySelectorAll(".surferPage")
        .forEach(element => {

            element.classList.remove("current");

        });

    document.getElementById("surf" + page)
        .classList.add("current");
}


function updateSurferDisplay() {

    document.getElementById("visitCounter").textContent =
        `A: ${surferVisits.A} | ` +
        `B: ${surferVisits.B} | ` +
        `C: ${surferVisits.C} | ` +
        `D: ${surferVisits.D}`;
}


/* =========================================
   LEVEL 4
   PAGERANK CALCULATION
   ========================================= */

let scores = {
    A: 0.25,
    B: 0.25,
    C: 0.25,
    D: 0.25
};

let round = 0;


function runRound() {

    if (round >= 3) return;

    round++;

    const newScores = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };


    /*
       Network:

       A → B, C
       B → A, D
       C → A
       D → C
    */


    newScores.B += scores.A / 2;
    newScores.C += scores.A / 2;

    newScores.A += scores.B / 2;
    newScores.D += scores.B / 2;

    newScores.A += scores.C;

    newScores.C += scores.D;


    scores = newScores;


    document.getElementById("roundNumber")
        .textContent = round;

    document.getElementById("roundStatus")
        .textContent = "CALCULATED";


    updateRanking();


    const explanation =
        document.getElementById("calculationExplanation");


    explanation.classList.remove("hidden");


    if (round === 1) {

        explanation.innerHTML = `
            <h3>🔄 Round 1</h3>
            <p>
                Each page passes its score through its outgoing links.
                If a page has two links, its score is split between them.
            </p>
        `;

    } else if (round === 2) {

        explanation.innerHTML = `
            <h3>📈 Round 2</h3>
            <p>
                The scores changed again because pages are receiving
                importance from pages that already have different scores.
            </p>
        `;

    } else {

        explanation.innerHTML = `
            <h3>🏆 Three rounds complete</h3>
            <p>
                Page A has the highest score in this example:
                <strong>0.40625</strong>.
            </p>

            <p>
                The important idea is that PageRank is not simply
                counting links. Importance flows through the link structure.
            </p>
        `;
    }


    if (round === 3) {

        document.getElementById("roundButton").textContent =
            "CONTINUE →";

        document.getElementById("roundButton").onclick = function() {
            goTo("level5");
        };

    } else {

        document.getElementById("roundButton").textContent =
            `RUN ROUND ${round + 1} →`;
    }
}


function updateRanking() {

    const rankingList =
        document.getElementById("rankingList");

    const sorted =
        Object.entries(scores)
            .sort((a, b) => b[1] - a[1]);


    rankingList.innerHTML = "";


    sorted.forEach((item, index) => {

        const page = item[0];
        const score = item[1];

        const row = document.createElement("div");

        row.className = "rankRow";

        row.innerHTML = `
            <strong>#${index + 1}</strong>
            <div>
                <strong>Page ${page}</strong>
                <div class="rankBar"
                     style="width:${score * 100}%">
                </div>
            </div>
            <strong>${score.toFixed(5)}</strong>
        `;

        rankingList.appendChild(row);
    });
}


/* =========================================
   LEVEL 5
   DAMPING
   ========================================= */

function showDamping() {

    document.getElementById("dampingReveal")
        .classList.remove("hidden");

    document.getElementById("dampingContinue")
        .classList.remove("hidden");
}


function updateDamping(value) {

    document.getElementById("dampingValue")
        .textContent = value + "%";


    const message =
        document.getElementById("dampingMessage");


    if (value == 0) {

        message.textContent =
            "⚠️ With no random jumps, the surfer can remain trapped in a loop.";

    } else if (value < 20) {

        message.textContent =
            "🚪 A small chance of jumping gives the surfer a way out.";

    } else {

        message.textContent =
            "🌐 More random jumps make escaping loops even more likely.";
    }
}


/* =========================================
   LEVEL 6
   GAME THE SYSTEM
   ========================================= */

let targetLinks = {
    A: false,
    B: false,
    C: false
};


function toggleLink(page) {

    if (page === "D") return;

    targetLinks[page] =
        !targetLinks[page];


    document.getElementById("game" + page)
        .classList.toggle(
            "selected",
            targetLinks[page]
        );
}


function calculateChallenge() {

    const count =
        Object.values(targetLinks)
            .filter(Boolean)
            .length;


    const result =
        document.getElementById("challengeResult");


    if (count === 0) {

        result.innerHTML =
            "❌ D has received no new links. Try adding some.";

        return;
    }


    if (count === 1) {

        result.innerHTML =
            "📈 D is gaining importance. Try adding another link.";

        return;
    }


    if (count === 2) {

        result.innerHTML =
            "🔥 D is becoming very important. One more could push it further.";

        return;
    }


    result.innerHTML =
        "🏆 D is now your strongest candidate! You just discovered how changing the link structure can change ranking.";


    document.getElementById("challengeContinue")
        .classList.remove("hidden");
}


/* =========================================
   LEVEL 7
   QUIZ
   ========================================= */

const answers = {
    1: "B",
    2: "A",
    3: "A",
    4: "A"
};

let answered = {};
let quizScore = 0;


function answerQuiz(question, answer) {

    if (answered[question]) return;

    answered[question] = true;


    const questionBox =
        document.querySelectorAll(".quizQuestion")[question - 1];

    const buttons =
        questionBox.querySelectorAll("button");


    buttons.forEach(button => {

        const text =
            button.textContent.trim();

        if (
            text.startsWith(answers[question] + ".")
        ) {

            button.classList.add("correct");

        }

    });


    if (answer === answers[question]) {

        quizScore++;

    } else {

        buttons.forEach(button => {

            if (button.textContent.trim()
                .startsWith(answer + ".")) {

                button.classList.add("wrong");

            }

        });

    }


    if (Object.keys(answered).length === 4) {

        showFinalScore();

    }
}


function showFinalScore() {

    const result =
        document.getElementById("quizResult");


    let message;


    if (quizScore === 4) {

        message =
            "🏆 PERFECT! You understand the core idea of PageRank.";

    } else if (quizScore >= 2) {

        message =
            "🎉 NICE! You've got the main idea of PageRank.";

    } else {

        message =
            "💡 You discovered the basics. Replay the missions to explore it again.";

    }


    result.innerHTML =
        `${message}<br><small>Score: ${quizScore}/4</small>`;
}


/* =========================================
   INITIALIZE
   ========================================= */

goTo("intro");
