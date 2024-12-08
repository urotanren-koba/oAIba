// main.js - メインアプリケーションロジック
import { MapComponent } from './components/Map.js';
import { LocationInput } from './components/LocationInput.js';
import { SuggestionComponent } from './components/Suggestion.js';

// バックエンドAPIのベースURL（開発環境用）
const API_BASE_URL = 'http://localhost:8000';

// コンポーネントのグローバル参照
let mapComponent;
let locationInput;
let suggestionComponent;

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// アプリケーションの初期化関数
async function initializeApp() {
    try {
        console.log('Initializing application...');
        // 地図の初期化
        mapComponent = new MapComponent('map-container');
        console.log('Map initialized successfully');

        // 位置情報入力の初期化
        locationInput = new LocationInput('location-input-container', handleLocationAdd);
        console.log('Location input initialized successfully');

        // 提案表示コンポーネントの初期化
        suggestionComponent = new SuggestionComponent('places-list-container');

        // バックエンドの疎通確認
        const response = await fetch(`${API_BASE_URL}/`);
        const data = await response.json();
        console.log('Backend connection successful:', data);

    } catch (error) {
        console.error('Error initializing application:', error);
        showError('アプリケーションの初期化中にエラーが発生しました。');
    }
}

// 位置が追加されたときのハンドラー
function handleLocationAdd(location) {
    console.log('New location added:', location);
    
    // 地図にマーカーを追加
    mapComponent.addMarker(
        { lat: location.lat, lng: location.lng },
        location.address,
        location.id
    );

    // マーカーが全て見えるように地図を調整
    mapComponent.fitBounds();

    // 2箇所以上の場所が登録されていれば、中間地点を計算
    const locations = locationInput.getLocations();
    if (locations.length >= 2) {
        calculateMidpoint(locations);
    }
}

// 中間地点を計算（バックエンドに計算を依頼）
async function calculateMidpoint(locations) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/calculate-midpoint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                locations: locations,
                transport_mode: document.getElementById('transport-mode').value
            })
        });

        if (!response.ok) {
            throw new Error('Failed to calculate midpoint');
        }

        const data = await response.json();
        console.log('Midpoint calculated:', data);

        // 中間地点をマップに表示
        if (data.midpoint) {
            mapComponent.addMarker(
                data.midpoint,
                '中間地点',
                'midpoint'
            );
            mapComponent.fitBounds();
        }

        // AI提案を表示
        suggestionComponent.displaySuggestion(data);

    } catch (error) {
        console.error('Error calculating midpoint:', error);
        showError('中間地点の計算に失敗しました。');
    }
}

// エラーメッセージ表示関数
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);

    // 5秒後にエラーメッセージを消去
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// グローバルスコープに公開（Google Maps callback用）
window.initializeApp = initializeApp;

// エクスポート（将来的な拡張のため）
export { initializeApp };