// LocationInput.js - 位置情報入力コンポーネント
export class LocationInput {
    constructor(containerId, onLocationAdd, onLocationRemove) {
        this.container = document.getElementById(containerId);
        this.locations = [];
        this.onLocationAdd = onLocationAdd;
        this.onLocationRemove = onLocationRemove;
        this.maxLocations = 4;
        this.geocoder = new google.maps.Geocoder();
        
        this.init();
    }

    init() {
        // イベントリスナーの設定
        const addButton = document.getElementById('add-location');
        const addressInput = document.getElementById('address-input');

        addButton.addEventListener('click', () => {
            this.handleAddLocation();
        });

        // Enterキーでも追加できるように
        addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddLocation();
            }
        });
    }

    async handleAddLocation() {
        const addressInput = document.getElementById('address-input');
        const address = addressInput.value.trim();
        
        if (!address) {
            this.showError('住所を入力してください');
            return;
        }

        if (this.locations.length >= this.maxLocations) {
            this.showError('最大4箇所までしか追加できません');
            return;
        }

        try {
            // 住所から座標を取得
            const result = await this.geocodeAddress(address);
            
            // 位置情報を保存
            const location = {
                address: address,
                lat: result.lat,
                lng: result.lng,
                id: Date.now().toString() // 一意のIDを追加
            };

            this.locations.push(location);
            
            // 入力欄をクリア
            addressInput.value = '';
            
            // リストを更新
            this.updateLocationsList();
            
            // コールバック関数を呼び出し
            if (this.onLocationAdd) {
                this.onLocationAdd(location);
            }

        } catch (error) {
            this.showError('住所の検索に失敗しました: ' + error.message);
        }
    }

    async geocodeAddress(address) {
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    const location = results[0].geometry.location;
                    resolve({
                        lat: location.lat(),
                        lng: location.lng()
                    });
                } else {
                    reject(new Error('Geocode failed: ' + status));
                }
            });
        });
    }

    updateLocationsList() {
        const listContainer = document.getElementById('locations-list');
        listContainer.innerHTML = '';

        this.locations.forEach((location, index) => {
            const locationElement = document.createElement('div');
            locationElement.className = 'location-item';
            locationElement.innerHTML = `
                <span>${location.address}</span>
                <button class="remove-location" data-index="${index}">削除</button>
            `;
            listContainer.appendChild(locationElement);

            // 削除ボタンのイベントリスナー
            const removeButton = locationElement.querySelector('.remove-location');
            removeButton.addEventListener('click', () => {
                this.removeLocation(index);
            });
        });
    }

    removeLocation(index) {
        const removedLocation = this.locations[index];
        this.locations.splice(index, 1);
        this.updateLocationsList();

        // 削除コールバックを呼び出し
        if (this.onLocationRemove) {
            this.onLocationRemove(removedLocation);
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.container.prepend(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // 保存された位置情報を取得
    getLocations() {
        return this.locations;
    }
}
