"use strict";
/*
* 1. Render songs
* 2. Scroll top
* 3. Play / Pause / Seek
* 4. CD rotate
* 5. Next / Prev
* 6. Random songs
* 7. Next / Repeat when ended
* 8. Active song
* 9. Scroll active song into view
* 10. Play song when click
// */

const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const playlist = $(".playlist");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const cdThumb = $(".cd-thumb");
const heading = $("header h2");
const audio = $("#audio");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const app = {
  songs: [
    {
      name: "Bao lời hoa mỹ",
      singer: "Nah",
      path: "./assets/music/Nah - Bao Lời Hoa Mỹ (Featuring Lynk Lee).mp4",
      image: "./assets/img/Nah.jpg",
    },

    {
      name: "ZOOM",
      singer: "Jessi",
      path: "./assets/music/ZOOM - Jessi - Bài hát, lyrics.mp3",
      image: "./assets/img/jessi-zoom-cover.webp",
    },

    {
      name: "Chạy về nơi phía anh",
      singer: "Khắc Việt",
      path: "./assets/music/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3",
      image: "./assets/img/chayvenoiphiaanh-khacviet.jpg",
    },
    {
      name: "Có em đây",
      singer: "Như Việt",
      path: "./assets/music/CoEmDay-NhuViet-7126614.mp3",
      image: "./assets/img/co em day - nhu viet_ dunghoangpham_ acv.jpg",
    },
    {
      name: "Có hẹn với thanh xuân",
      singer: "MONSTAR",
      path: "./assets/music/cohenvoithanhxuan-MONSTAR-7050201.mp3",
      image: "./assets/img/co hen voi thanh xuan - monstar.jpg",
    },
    {
      name: "Đế vương",
      singer: "Đình Dũng",
      path: "./assets/music/DeVuong-DinhDungACV-7121634.mp3",
      image: "./assets/img/de vuong - dinh dung_ acv.jpg",
    },
    {
      name: "Hoa tàn tình tan",
      singer: "Giang Jolee",
      path: "./assets/music/HoaTanTinhTan-GiangJolee-7126977.mp3",
      image: "./assets/img/hoa tan tinh tan - giang jolee.jpg",
    },
    {
      name: "Mẹ em nhắc anh",
      singer: "Orange, Hamlet Trương",
      path: "./assets/music/MeEmNhacAnh-OrangeHamletTruong-7136377.mp3",
      image: "./assets/img/me em nhac anh - orange_ hamlet truong.jpg",
    },
    {
      name: "Tệ thật, anh nhớ em",
      singer: "Thanh Hưng",
      path: "./assets/music/TeThatAnhNhoEm-ThanhHung-7132634.mp3",
      image: "./assets/img/te that_ anh nho em - thanh hung.jpg",
    },
    {
      name: "Và ngày nào đó",
      singer: "Quang Trung, Vũ Thảo My",
      path: "./assets/music/VaNgayNaoDo-StudioPartyQuangTrungVuThaoMy-7146301.mp3",
      image: "./assets/img/va ngay nao do - studio party_ quang trung__.jpg",
    },
    {
      name: "Yêu đương khó quá thì chạy về khóc với anh",
      singer: "Erik",
      path: "./assets/music/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3",
      image: "./assets/img/yeu duong kho qua thi chay ve khoc voi_yythk.jpg",
    },
    {
      name: "Yêu em hơn mỗi ngày",
      singer: "Andiez",
      path: "./assets/music/YeuEmHonMoiNgay-Andiez-7136374.mp3",
      image: "./assets/img/yeu em hon moi ngay - andiez.jpg",
    },
  ],
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isPlayed: [],
  isConfig: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  setConfig(key, value) {
    this.isConfig[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.isConfig));
  },

  loadConfig() {
    this.isRandom = this.isConfig.isRandom;
    this.isRepeat = this.isConfig.isRepeat;
  },

  renderSong() {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image
        }">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },

  loadCurrentSong() {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.isPlayed.includes(randomIndex));
    if (this.isPlayed.length === this.songs.length - 1) {
      this.isPlayed = [this.currentIndex];
    }
    this.currentIndex = randomIndex;
    this.loadCurrentSong();
  },

  scrollToActive() {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  },

  handleEvents() {
    const _this = this;

    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        interations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    audio.ontimeupdate = function () {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      if (audio.duration) {
        progress.value = progressPercent;
      }
    };

    progress.oninput = function () {
      const audioCurrentTime = (this.value * audio.duration) / 100;
      audio.currentTime = audioCurrentTime;
    };

    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.isPlayed.push(_this.currentIndex);
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.renderSong();
      _this.scrollToActive();
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.isPlayed.push(_this.currentIndex);
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.renderSong();
      _this.scrollToActive();
    };

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".song .option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.renderSong();
          audio.play();
        }
      }
    };
  },

  start() {
    this.renderSong();

    this.loadConfig();

    this.defineProperties();

    this.loadCurrentSong();

    this.handleEvents();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
