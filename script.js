const SPREADSHEET_ID = '1BEi1MzL4-2vTVGa_2yyYnVkkDcSch6GIZKeWUHRYFxY';

async function renderAll() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=0&t=${Date.now()}`;
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        // 1. КОМАНДА (Колонки A, B, C)
        const teamDiv = document.getElementById('team-list');
        teamDiv.innerHTML = rows.slice(1)
            .filter(r => r.c[0] && r.c[0].v) // Только если есть имя
            .map(r => `
                <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-600 text-center">
                    <h3 class="font-bold text-lg text-blue-900">${r.c[0].v}</h3>
                    <p class="text-blue-500 text-xs uppercase font-bold mb-2">${r.c[1] ? r.c[1].v : ''}</p>
                    <p class="text-gray-500 text-sm">"${r.c[2] ? r.c[2].v : ''}"</p>
                </div>`).join('');

        // 2. РЕЙТИНГ (Колонки E, F — индексы 4 и 5)
        const leaderboardDiv = document.getElementById('leaderboard');
        const ratingRows = rows.slice(1).filter(r => r.c[4] && r.c[4].v);
        leaderboardDiv.innerHTML = ratingRows.map((r, i) => `
            <div class="flex justify-between items-center p-4 border-b">
                <span>${i+1}. ${r.c[4].v}</span>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">${r.c[5] ? r.c[5].v : 0} Б</span>
            </div>`).join('');

        // 3. КВЕСТЫ (Колонки H, I — индексы 7 и 8)
        const questDiv = document.getElementById('quests-list');
        const questRows = rows.slice(1).filter(r => r.c[7] && r.c[7].v);
        questDiv.innerHTML = questRows.map(r => `
            <div class="bg-white border-2 border-dashed border-blue-200 p-4 rounded-xl flex justify-between items-center shadow-sm mb-2">
                <span class="font-medium text-gray-700">${r.c[7].v}</span>
                <span class="text-green-600 font-black">+${r.c[8] ? r.c[8].v : 0} Б</span>
            </div>`).join('');

    } catch (e) {
        console.error("Ошибка:", e);
    }
}

document.addEventListener('DOMContentLoaded', renderAll);
