module.exports = (Plugin, Library) => {
    const {Patcher} = Library;
    return class MemeSounds extends Plugin {

        onStart() {
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: Added sounds or smth." + a[0];
            });
        }

        onStop() {
            Patcher.unpatchAll();
        }
    };
};
