const SPREADSHEET_ID = '1BEi1MzL4-2vTVGa_2yyYnVkkDcSch6GIZKeWUHRYFxY';

async function renderAll() {
    try {
        // Запрос только к первой вкладке (gid=0)
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=0&t=${Date.now()}`;
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        // --- 1. АКТИВИСТЫ (23 человека из колонок A, B, C) ---
        const teamDiv = document.getElementById('team-list');
        // Берем все строки, где заполнена колонка A
        teamDiv.innerHTML = rows.slice(1).map(r => (r.c[0] && r.c[0].v) ? `
            <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-600 text-center">
                <h3 class="font-bold text-lg text-blue-900">${r.c[0].v}</h3>
                <p class="text-blue-500 text-xs uppercase font-bold mb-2">${r.c[1]?.v || ''}</p>
                <p class="text-gray-500 text-sm">"${r.c[2]?.v || ''}"</p>
            </div>` : '').join('');

        // --- 2. РЕЙТИНГ (Данные из колонок E и F) ---
        const leaderboardDiv = document.getElementById('leaderboard');
        leaderboardDiv.innerHTML = rows.slice(1).map((r, i) => (r.c[4] && r.c[4].v) ? `
            <div class="flex justify-between items-center p-4 border-b">
                <span>${r.c[4].v}</span>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">${r.c[5]?.v || 0} Б</span>
            </div>` : '').join('');

        // --- 3. КВЕСТЫ (Данные из колонок H и I) ---
        const questDiv = document.getElementById('quests-list');
        questDiv.innerHTML = rows.slice(1).map(r => (r.c[7] && r.c[7].v) ? `
            <div class="bg-white border-2 border-dashed border-blue-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                <span class="font-medium text-gray-700">${r.c[7].v}</span>
                <span class="text-green-600 font-black">+${r.c[8]?.v || 0} Б</span>
            </div>` : '').join('');

    } catch (e) {
        console.error("Ошибка: Проверь доступ к таблице!", e);
    }
}

document.addEventListener('DOMContentLoaded', renderAll);
