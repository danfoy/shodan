/*
This module determines the current map in rotation in Apex legends.

For season 10, all 3 maps so far releasaed are in rotation for casual mode.
The amount of time each map is in rotation changes over the course of the day
from between one to two hours, and this entire rotation schedule repeats every
27 hours.
*/

class ApexMapsPlaylist {
    constructor (maps, durations, startTime) {
        this.maps = maps;
        this.durations = durations;
        this.startTime = startTime;
        this.rotations = this.getRotations();
    };

    get currentMap() {
        const thisRotation = this.rotations[this.getPlaylistIndex()];
        const nextRotation = this.rotations[this.getPlaylistIndex() + 1];
        return {
            map: thisRotation.map,
            duration: thisRotation.duration,
            timeRemaining: nextRotation.offset - this.getOffset()
        };
    };

    get nextMap() {
        const currentMapIndex = this.getPlaylistIndex();
        // Indexes need to loop if we're at the end of the playlist
        const nextMapIndex = currentMapIndex + 1 < this.rotations.length
            ? currentMapIndex + 1
            : 0
        const nextMap = this.rotations[nextMapIndex];
        return {
            map: nextMap.map,
            duration: nextMap.duration
        };
    };

    get playlistTotalDuration() {
        return this.rotations.reduce( (accumulator, currentItem) => {
            return accumulator + currentItem.duration;
        }, 0);
    };

    getRotations() {
        let timeAccumulator = 0;
        let rotations = []
        this.durations.forEach( (duration) => {
            this.maps.forEach( (map) => {
                const thisRotation = {
                    offset: timeAccumulator,
                    map: map,
                    duration: duration
                };
                timeAccumulator += duration;
                return rotations.push(thisRotation);
            });
        });
        return rotations;
    };

    getOffset(target = new Date()) {
        // times are converted to minutes
        const targetTime = (target.getTime() / 1000 / 60);
        const startTime = (this.startTime.getTime() / 1000 / 60);
        return Math.floor(
            ( ( targetTime - startTime ) % this.playlistTotalDuration )
        );
    };

    getPlaylistIndex(target = new Date()) {
        const offset = this.getOffset(target);
        return this.rotations.findIndex( (map) => {
            return map.offset + map.duration >= offset
        });
    };

    getMapByDate(target = new Date()) {
        return this.rotations[this.getPlaylistIndex(target)].map;
    };
};

module.exports = ApexMapsPlaylist;
