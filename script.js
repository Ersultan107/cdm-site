const SPREADSHEET_ID = '1BEi1MzL4-2vTVGa_2yyYnVkkDcSch6GIZKeWUHRYFxY';

async function fetchSheet(sheetName) {
    try {
        // Мы добавляем случайный параметр &t=, чтобы Google думал, что это новый запрос
        // И используем sheet= чтобы он переключил вкладку
        const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        // Очистка данных от мусора Google
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows;

        // Проверяем, есть ли данные в этой вкладке
        if (!rows || rows.length <= 1) {
            console.warn(`Вкладка ${sheetName} пустая или не загрузилась`);
            return [];
        }

        return rows.slice(1); // Возвращаем всё, кроме первой строки
    } catch (e) {
        console.error("Критическая ошибка загрузки " + sheetName, e);
        return [];
    }
}

async function renderAll() {
    console.log("Начинаю полное обновление данных...");

    // 1. ЗАГРУЗКА КОМАНДЫ (Лист Team)
    const teamRows = await fetchSheet('Team');
    const teamDiv = document.getElementById('team-list');
    if (teamDiv) {
        teamDiv.innerHTML = teamRows.map(r => r.c[0] ? `
            <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-600 text-center fade-in">
                <h3 class="font-bold text-lg text-blue-900">${r.c[0].v}</h3>
                <p class="text-blue-500 text-xs uppercase font-bold mb-2">${r.c[1]?.v || ''}</p>
                <p class="text-gray-500 text-sm">"${r.c[2]?.v || ''}"</p>
            </div>` : '').join('');
    }

    // 2. ЗАГРУЗКА РЕЙТИНГА (Лист Rating)
    const ratingRows = await fetchSheet('Rating');
    const leaderboardDiv = document.getElementById('leaderboard');
    if (leaderboardDiv) {
        const sorted = ratingRows
            .filter(r => r.c && r.c[0] && r.c[1])
            .sort((a, b) => (Number(b.c[1].v) || 0) - (Number(a.c[1].v) || 0));
        
        leaderboardDiv.innerHTML = sorted.map((r, i) => `
            <div class="flex justify-between items-center p-4 border-b ${i===0?'bg-yellow-50':''}">
                <span class="font-medium">${i+1}. ${r.c[0].v}</span>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">${r.c[1].v} Б</span>
            </div>`).join('');
    }

    // 3. ЗАГРУЗКА КВЕСТОВ (Лист Quests)
    const questRows = await fetchSheet('Quests');
    const questDiv = document.getElementById('quests-list');
    if (questDiv) {
        // Очищаем перед вставкой, чтобы старое имя точно исчезло
        questDiv.innerHTML = ""; 
        questDiv.innerHTML = questRows.map(r => r.c && r.c[0] ? `
            <div class="bg-white border-2 border-dashed border-blue-200 p-4 rounded-xl flex justify-between items-center shadow-sm fade-in">
                <span class="font-medium text-gray-700">${r.c[0].v}</span>
                <span class="text-green-600 font-black">+${r.c[1]?.v || 0} Б</span>
            </div>` : '').join('');
    }
}

// Запускаем
renderAll();
