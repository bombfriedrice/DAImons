class DaimonCharacter {
    constructor(name, friendliness, knowledgeLevel) {
        this.name = name;
        this.friendliness = friendliness;
        this.knowledgeLevel = knowledgeLevel;
    }

    getSettings() {
        return `Name: ${this.name}, Friendliness: ${this.friendliness}, Knowledge Level: ${this.knowledgeLevel}`;
    }
}

const daimonCharacter = new DaimonCharacter('Daimon', 'friendly', 'high');
