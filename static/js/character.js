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

class Character extends DaimonCharacter {
    constructor(name, friendliness, knowledgeLevel, personality) {
        super(name, friendliness, knowledgeLevel);
        this.personality = personality;
    }

    getSettings() {
        return `${super.getSettings()}, Personality: ${this.personality}`;
    }
}

const daimonCharacter = new Character('Daimon', 'friendly', 'high', 'wise and helpful');
const cubeCharacter = new Character('Cubey', 'playful', 'medium', 'energetic and curious');
const sphereCharacter = new Character('Sphera', 'calm', 'high', 'philosophical and patient');

const characters = [daimonCharacter, cubeCharacter, sphereCharacter];
