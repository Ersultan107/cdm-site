const SPREADSHEET_ID = '1BEi1MzL4-2vTVGa_2yyYnVkkDcSch6GIZKeWUHRYFxY';

const GIDS = {
    'Team': '0',
    'Rating': '275005876',
    'Quests': '1346137915'
};

async function fetchSheetByGid(gid) {
    try {
        // Добавляем t=Date.now чтобы Google не подсовывал старье из памяти
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}&t=${Date.now()}`;
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substring(47).slice(0, -2));
        return json.table.rows;
    } catch (e) {
        return [];
    }
}

async function renderAll() {
    // ЗАГРУЗКА КОМАНДЫ
    const teamData = await fetchSheetByGid(GIDS.Team);
    if (teamData.length > 0) {
        document.getElementById('team-list').innerHTML = teamData.slice(1).map(r => r.c && r.c[0] ? `
            <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-600 text-center">
                <h3 class="font-bold text-lg text-blue-900">${r.c[0].v}</h3>
                <p class="text-blue-500 text-xs uppercase font-bold mb-2">${r.c[1]?.v || ''}</p>
                <p class="text-gray-500 text-sm">"${r.c[2]?.v || ''}"</p>
            </div>` : '').join('');
    }

    // ЗАГРУЗКА РЕЙТИНГА
    const ratingData = await fetchSheetByGid(GIDS.Rating);
    if (ratingData.length > 0) {
        const rows = ratingData.slice(1).filter(r => r.c && r.c[0]);
        document.getElementById('leaderboard').innerHTML = rows.map((r, i) => `
            <div class="flex justify-between items-center p-4 border-b">
                <span>${i+1}. ${r.c[0].v}</span>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">${r.c[1]?.v || 0} Б</span>
            </div>`).join('');
    }

    // ЗАГРУЗКА КВЕСТОВ
    const questData = await fetchSheetByGid(GIDS.Quests);
    if (questData.length > 0) {
        const rows = questData.slice(1).filter(r => r.c && r.c[0]);
        document.getElementById('quests-list').innerHTML = rows.map(r => `
            <div class="bg-white border-2 border-dashed border-blue-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                <span class="font-medium text-gray-700">${r.c[0].v}</span>
                <span class="text-green-600 font-black">+${r.c[1]?.v || 0} Б</span>
            </div>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', renderAll);
