// Suggestion.js - AI提案表示コンポーネント
export class SuggestionComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="suggestion-container">
                <h3>🤖 待ち合わせスポット</h3>
                <div class="suggestion-content"></div>
                <div class="travel-times"></div>
            </div>
        `;
    }

    // 提案内容を表示
    displaySuggestion(data) {
        const suggestionContent = this.container.querySelector('.suggestion-content');
        const travelTimesContent = this.container.querySelector('.travel-times');
        
        // 提案文を表示
        suggestionContent.innerHTML = `
            <div class="suggestion-box">
                <p>${data.suggestion || '提案を生成中...'}</p>
            </div>
        `;
        
        // 移動時間情報を表示
        if (data.travel_times && data.travel_times.length > 0) {
            const travelTimesList = data.travel_times
                .map(time => `
                    <div class="travel-time-item">
                        <span class="location">${time.from_address}</span>
                        <span class="travel-info">
                            <span class="time">${time.duration}</span>
                            <span class="distance">(${time.distance})</span>
                        </span>
                    </div>
                `)
                .join('');
                
            travelTimesContent.innerHTML = `
                <div class="travel-times-box">
                    <h4>🚶‍♂️ 移動時間</h4>
                    <div class="travel-times-list">
                        ${travelTimesList}
                    </div>
                </div>
            `;
        }
    }

    // エラーメッセージを表示
    showError(message) {
        this.container.innerHTML = `
            <div class="suggestion-error">
                <p>😢 ${message}</p>
            </div>
        `;
    }
}