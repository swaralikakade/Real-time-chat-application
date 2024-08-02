const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const Filter = require("bad-words");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.detectEvilUsers = onDocumentWritten(
    "messages/{msgId}",
    async (change, context) => {
      const filter = new Filter();
      const {text, uid} = change.after.data();

      if (filter.isProfane(text)) {
        const cleaned = filter.clean(text);
        await change.after.ref.update({
          text: `I got banned for ${cleaned}`,
        });
        await db.collection("banned").doc(uid).set({});
      }
    },
);
