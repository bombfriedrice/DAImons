class Character {
    constructor(name, friendliness, knowledgeLevel, personality) {
        this.name = name;
        this.friendliness = friendliness;
        this.knowledgeLevel = knowledgeLevel;
        this.personality = personality;
    }

    getSettings() {
        return `Name: ${this.name}, Friendliness: ${this.friendliness}, Knowledge Level: ${this.knowledgeLevel}, Personality: ${this.personality}`;
    }
}

const rjmonCharacter = new Character('RJmon', 'friendly', 'high', 'wise and helpful');
const agumonCharacter = new Character('Agumon', 'playful', 'medium', 'energetic and curious');
const veemonCharacter = new Character('Veemon', 'calm', 'high', 'philosophical and patient');

const characters = [rjmonCharacter, agumonCharacter, veemonCharacter];
