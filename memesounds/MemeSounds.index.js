module.exports = (Plugin, Library) => {
    const {Patcher} = Library;
    return class MemeSounds extends Plugin {

        onStart() {
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: gay" + a[0];
            });
        }

        onStop() {
            Patcher.unpatchAll();
        }
    };
};
