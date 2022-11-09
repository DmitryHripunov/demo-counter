/*global UIkit, Vue */

(() => {
  const notification = (config) =>
    UIkit.notification({
      pos: "top-right",
      timeout: 5000,
      ...config,
    });

  const alert = (message) =>
    notification({
      message,
      status: "danger",
    });

  const info = (message) =>
    notification({
      message,
      status: "success",
    });

  const fetchJson = (...args) =>
    fetch(...args)
      .then((res) =>
        res.ok
          ? res.status !== 204
            ? res.json()
            : null
          : res.text().then((text) => {
            throw new Error(text);
          })
      )
      .catch((err) => {
        alert(err.message);
      });

  new Vue({
    el: "#app",
    data: {
      desc: "",
      activeTimers: [],
      oldTimers: [],
    },
    methods: {
      webSocket() {
        let ws;
        const wsProto = location.protocol === 'https:' ? 'wss:' : 'ws:';

        if (ws) {
          ws.onerror = ws.onopen = ws.onclose = null;
          ws.close();
        }

        ws = new WebSocket(`${wsProto}//${location.host}`);

        ws.addEventListener('error', () => {
          console.log('WebSocket error');
          location.href = '/logout';
        });

        ws.addEventListener('open', () => {
          console.log('WebSocket connection established');
        });

        ws.addEventListener('close', () => {
          console.log('WebSocket connection closed');
          ws = null;
          location.href = '/logout';
        });

        return ws;
      },
      createTimer() {
        const description = this.desc;
        this.desc = "";
        fetchJson("/api/timers", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description }),
        }).then(() => {
          info(`Created new timer "${description}"`);
          window.location.reload();
        });
      },
      stopTimer(id) {
        fetchJson(`/api/timers/${id}/stop`, {
          method: "post",
        }).then(() => {
          info(`Stopped the timer [${id}]`);
          window.location.reload();
        });
      },
      formatTime(ts) {
        return new Date(ts).toTimeString().split(" ")[0];
      },
      formatDuration(d) {
        d = Math.floor(d / 1000);
        const s = d % 60;
        d = Math.floor(d / 60);
        const m = d % 60;
        const h = Math.floor(d / 60);
        return [h > 0 ? h : null, m, s]
          .filter((x) => x !== null)
          .map((x) => (x < 10 ? "0" : "") + x)
          .join(":");
      },
      ws() {
        const ws = this.webSocket();

        ws.addEventListener('message', async (message) => {
          let data;
          try {
            data = await JSON.parse(message.data)
          } catch (err) {
            console.log(err)
            return;
          }

          if (data.type === 'all_timers') {
            this.activeTimers = data.activeTimers;
            this.oldTimers = data.oldTimers;
          }

          if (data.type === 'active_timers') {
            this.activeTimers = data.activeTimers;
          }
        });
      }
    },
    created() {
      this.ws();
    },
  });
})();
