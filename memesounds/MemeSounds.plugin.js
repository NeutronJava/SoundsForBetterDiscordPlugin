/**
 * @name MemeSounds
 * @version 0.6.1
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!
 * @invite SsTkJAP3SE
 * @author Neutron05#3486
 * @authorId 543661347615932426
 * @authorLink https://github.com/NeutronJava/
 * @source https://github.com/NeutronJava/SoundsForBetterDiscordPlugin/blob/main/memesounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/NeutronJava/SoundsForBetterDiscordPlugin/main/memesounds/MemeSounds.plugin.js
 */

module.exports = (() => {
	
	/* Configuration */
	const config = {info: {name: "Meme Sounds UPGRADED!", authors: [{name: "Neutron05#3486", discord_id: "543661347615932426", github_username: "NeutronJava"}], version: "0.6.1", description: "MORE SOUNDS. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out!", github: "https://github.com/NeutronJava/SoundsForBetterDiscordPlugin/blob/main/memesounds/MemeSounds.plugin.js", github_raw: "https://raw.githubusercontent.com/NeutronJava/SoundsForBetterDiscordPlugin/main/memesounds/MemeSounds.plugin.js"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}, {id: "SoundPitch", name: "Sound effects have random pitch", note: "When enabled, sound effects will play with random pitches.", type: "switch", value: false}]}], changelog: [{title: "New sounds", items: ["fish", "emojis idk lol just check the code to see it"]}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {
		
		if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/NeutronJava/SoundsForBetterDiscordPlugin/main/memesounds/MemeSounds.plugin.jsE");
		
		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /noice/gmi, file: "noice.mp3", duration: 600},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof.mp3", duration: 250},
				{re: /bruh/gmi, file: "bruh.mp3", duration: 470},
				{re: /🗿/gmi, file: "moyai.mp3", duration: 100},
				{re: /gay/gmi, file: "gay.mp3", duration: 100},
				{re: /😡/gmi, file: "failmeoften.mp3", duration: 100},
				{re: /🤬/gmi, file: "spareribs.mp3", duration: 100},
				{re: /💀/gmi, file: "skullemoji.mp3", duration: 550},
				{re: /😳/gmi, file: "flushing.mp3", duration: 100},
				{re: /🤨/gmi, file: "waterhose.mp3", duration: 100},
				{re: /😏/gmi, file: "mlady.mp3", duration: 100},
				{re: /😔/gmi, file: "goblin.mp3", duration: 100},
				{re: /😎/gmi, file: "letsgo.mp3", duration: 100},
				{re: /🤓/gmi, file: "nerd.mp3", duration: 100},
				{re: /🤠/gmi, file: "cowboyhootin.mp3", duration: 100},
				{re: /🤡/gmi, file: "clown.mp3", duration: 100},
				{re: /bozo/gmi, file: "nerd.mp3", duration: 100},
				{re: /🥺/gmi, file: "pleadingsir.mp3", duration: 100},
				{re: /😭/gmi, file: "goblin.mp3", duration: 100},
				{re: /🐟/gmi, file: "fish.mp3", duration: 100},
				{re: /🎤 🦟/gmi, file: "mosquitomusic.mp3", duration: 100},
				{re: /😴/gmi, file: "mimi.mp3", duration: 100},
				{re: /🥱/gmi, file: "snoring.mp3", duration: 100},
				{re: /🥶/gmi, file: "ice.mp3", duration: 100},
				{re: /bogos binted/gmi, file: "bogosbinted.mp3", duration: 100},
				{re: /👽/gmi, file: "fade.mp3", duration: 100}
				
			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/NeutronJava/SoundsForBetterDiscordPlugin/raw/main/memesounds/Sounds/"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							if (this.settings.setting.SoundPitch) {
								audio.play();
								} else {
								
							audio.play();
									}
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();

