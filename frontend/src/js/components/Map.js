// Map.js - 地図コンポーネント
export class MapComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.map = null;
        this.markers = new Map(); // マーカーをIDで管理
        this.init();
    }

    init() {
        try {
            console.log('Initializing map...');
            // 東京を中心に地図を初期化
            this.map = new google.maps.Map(this.container, {
                center: { lat: 35.6812362, lng: 139.7671248 }, // 東京駅
                zoom: 13,
                styles: [
                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                    }
                ]
            });
            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Error initializing map:', error);
            throw error;
        }
    }

    // マーカーを追加
    addMarker(location, title = '', id) {
        try {
            const marker = new google.maps.Marker({
                position: location,
                map: this.map,
                title: title
            });
            if (id) {
                this.markers.set(id, marker);
            }
            return marker;
        } catch (error) {
            console.error('Error adding marker:', error);
            throw error;
        }
    }

    // 特定のマーカーを削除
    removeMarker(id) {
        const marker = this.markers.get(id);
        if (marker) {
            marker.setMap(null);
            this.markers.delete(id);
        }
    }

    // 全てのマーカーを削除
    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers.clear();
    }

    // マーカーが全て見えるように地図の表示範囲を調整
    fitBounds() {
        if (this.markers.size === 0) return;

        const bounds = new google.maps.LatLngBounds();
        this.markers.forEach(marker => bounds.extend(marker.getPosition()));
        this.map.fitBounds(bounds);

        // マーカーが1つの場合はズームレベルを調整
        if (this.markers.size === 1) {
            this.map.setZoom(15);
        }
    }
}
