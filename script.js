// Timezone API - Get current time for Manila
function updateTimezone() {
  const manilaTime = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Manila",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  const manilaElement = document.getElementById("timezoneDisplay")
  if (manilaElement) {
    manilaElement.textContent = manilaTime
  }
}

// Update timezone every second
setInterval(updateTimezone, 1000)
updateTimezone()

// Weather API - Fetch current weather for Manila
async function fetchWeather() {
  const weatherTemp = document.getElementById("weatherTemp")
  const weatherDesc = document.getElementById("weatherDesc")
  const humidityVal = document.getElementById("humidityVal")
  const windVal = document.getElementById("windVal")
  const weatherVisuals = document.getElementById("weatherVisuals")
  const weatherEmoji = document.getElementById("weatherEmoji")

  if (!weatherTemp) return

  try {
    // Open-Meteo API for Manila (Lat: 14.60, Lon: 120.98)
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=14.60&longitude=120.98&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
    )
    
    if (!response.ok) throw new Error('Weather data unavailable')
    
    const data = await response.json()
    const current = data.current

    // Update Text Content
    weatherTemp.textContent = `${Math.round(current.temperature_2m)}°C`
    humidityVal.textContent = `${current.relative_humidity_2m}%`
    windVal.textContent = `${current.wind_speed_10m} km/h`
    
    // Interpret WMO Weather Code
    const code = current.weather_code
    let desc = "Clear"
    let emoji = "☀️"
    let gradient = "linear-gradient(135deg, #fce38a 0%, #f38181 100%)" // Default Sunny

    // 0: Clear sky
    if (code === 0) {
        desc = "Sunny"
        emoji = "☀️"
        gradient = "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)"
    } 
    // 1-3: Cloudy
    else if (code >= 1 && code <= 3) {
        desc = "Cloudy"
        emoji = "☁️"
        gradient = "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
    } 
    // 45, 48: Fog
    else if (code >= 45 && code <= 48) {
        desc = "Foggy"
        emoji = "🌫️"
        gradient = "linear-gradient(135deg, #d7d2cc 0%, #304352 100%)"
    } 
    // 51-67: Drizzle/Rain
    else if (code >= 51 && code <= 67) {
        desc = "Rainy"
        emoji = "🌧️"
        gradient = "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)"
    } 
    // 71-77: Snow (Unlikely in Manila, but good for completeness)
    else if (code >= 71 && code <= 77) {
        desc = "Snowy"
        emoji = "❄️"
        gradient = "linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)"
    }
    // 80-82: Showers
    else if (code >= 80 && code <= 82) {
        desc = "Showers"
        emoji = "🌦️"
        gradient = "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)"
    } 
    // 95+: Thunderstorm
    else if (code >= 95) {
        desc = "Thunderstorm"
        emoji = "⛈️"
        gradient = "linear-gradient(135deg, #141E30 0%, #243B55 100%)"
    }

    weatherDesc.textContent = desc
    if (weatherEmoji) weatherEmoji.textContent = emoji 
    if (weatherVisuals) {
        weatherVisuals.style.background = gradient
    }

  } catch (err) {
    console.error("Error fetching weather:", err)
    if(weatherDesc) weatherDesc.textContent = "Offline"
    if(weatherEmoji) weatherEmoji.textContent = "⚠️"
  }
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      closeMenu()
    }
  })
})

// Hamburger menu toggle
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

if (hamburger) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })
}

function closeMenu() {
  hamburger?.classList.remove("active")
  navMenu?.classList.remove("active")
}

// Initialize EmailJS globally
(function() {
    emailjs.init({
        publicKey: "2TIPYICV_x6xX3km4",
    });
})();

// Wait for the DOM to load before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
  
  // Initialize Weather
  fetchWeather()
  // Refresh weather every 10 minutes
  setInterval(fetchWeather, 600000)

  const form = document.getElementById("contact-form")

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault()

      // Button Loading State
      const btn = form.querySelector('button');
      const originalText = btn.innerText;
      btn.innerText = 'Sending...';
      btn.disabled = true;

      // Prepare parameters matching your EmailJS Template variables: 
      // {{from_name}}, {{time}}, {{message}}
      const templateParams = {
        // Map HTML input "user_name" to template variable "from_name"
        from_name: document.getElementById("user_name").value,
        
        // Map HTML input "message" to template variable "message"
        message: document.getElementById("message").value,
        
        // Generate current time for template variable "time"
        time: new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }),
        
        // Target email
        to_email: "franco.mosquin@email.lcup.edu.ph",
      }

      // Send the email using EmailJS
      // format: emailjs.send(serviceID, templateID, templateParams);
      emailjs.send("service_lqmn17b", "template_brn4s5b", templateParams).then(
        (response) => {
          console.log("Email sent successfully!", response.status, response.text)
          alert("Your message has been sent successfully!")
          form.reset()
          btn.innerText = originalText;
          btn.disabled = false;
        },
        (error) => {
          console.error("Email sending failed:", error)
          alert("Failed to send message. Please check the console for details.\nError: " + JSON.stringify(error))
          btn.innerText = originalText;
          btn.disabled = false;
        },
      )
    })
  }

  // Certificate card click handler
  const certCards = document.querySelectorAll(".cert-card")
  const modal = document.getElementById("certModal")
  const modalImage = document.getElementById("modalImage")
  const modalCaption = document.getElementById("modalCaption")
  const modalClose = document.querySelector(".modal-close")

  if (certCards && modal) {
    certCards.forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img")
        const title = card.getAttribute("data-title")
        if (img && img.src) {
          modal.style.display = "block"
          modalImage.src = img.src
          modalCaption.textContent = title
        }
      })
    })

    // Close modal on close button click
    if (modalClose) {
      modalClose.addEventListener("click", () => {
        modal.style.display = "none"
      })
    }

    // Close modal on background click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })

    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.style.display = "none"
      }
    })
  }

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "slideInUp 0.8s ease-out forwards"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section)
  })

  // Active navigation link highlight
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-link")

    let current = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href").slice(1) === current) {
        link.style.color = "var(--highlight-color)"
      } else {
        link.style.color = ""
      }
    })
  })

  // Perlin Noise implementation for wave generation
  class Grad {
    constructor(x, y, z) {
      this.x = x
      this.y = y
      this.z = z
    }
    dot2(x, y) {
      return this.x * x + this.y * y
    }
  }

  class Noise {
    constructor(seed = 0) {
      this.grad3 = [
        new Grad(1, 1, 0),
        new Grad(-1, 1, 0),
        new Grad(1, -1, 0),
        new Grad(-1, -1, 0),
        new Grad(1, 0, 1),
        new Grad(-1, 0, 1),
        new Grad(1, 0, -1),
        new Grad(-1, 0, -1),
        new Grad(0, 1, 1),
        new Grad(0, -1, 1),
        new Grad(0, 1, -1),
        new Grad(0, -1, -1),
      ]
      this.p = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37,
        240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
        33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146,
        158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
        63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100,
        109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
        59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153,
        101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246,
        97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192,
        214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114,
        67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
      ]
      this.perm = new Array(512)
      this.gradP = new Array(512)
      this.seed(seed)
    }
    seed(seed) {
      if (seed > 0 && seed < 1) seed *= 65536
      seed = Math.floor(seed)
      if (seed < 256) seed |= seed << 8
      for (let i = 0; i < 256; i++) {
        const v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255)
        this.perm[i] = this.perm[i + 256] = v
        this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12]
      }
    }
    fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10)
    }
    lerp(a, b, t) {
      return (1 - t) * a + t * b
    }
    perlin2(x, y) {
      let X = Math.floor(x),
        Y = Math.floor(y)
      x -= X
      y -= Y
      X &= 255
      Y &= 255
      const n00 = this.gradP[X + this.perm[Y]].dot2(x, y)
      const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1)
      const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y)
      const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1)
      const u = this.fade(x)
      return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y))
    }
  }

  // Waves animation class
  class WavesAnimation {
    constructor(container, config = {}) {
      this.container = container
      this.config = {
        lineColor: config.lineColor || "#00d4ff",
        backgroundColor: config.backgroundColor || "transparent",
        waveSpeedX: config.waveSpeedX || 0.02,
        waveSpeedY: config.waveSpeedY || 0.01,
        waveAmpX: config.waveAmpX || 40,
        waveAmpY: config.waveAmpY || 20,
        friction: config.friction || 0.9,
        tension: config.tension || 0.01,
        maxCursorMove: config.maxCursorMove || 120,
        xGap: config.xGap || 12,
        yGap: config.yGap || 36,
      }

      this.canvas = document.createElement("canvas")
      this.canvas.style.display = "block"
      this.canvas.style.width = "100%"
      this.canvas.style.height = "100%"
      container.appendChild(this.canvas)

      this.ctx = this.canvas.getContext("2d")
      this.noise = new Noise(Math.random())
      this.lines = []
      this.mouse = {
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        v: 0,
        vs: 0,
        a: 0,
        set: false,
      }
      this.bounding = { width: 0, height: 0, left: 0, top: 0 }
      this.frameId = null

      this.init()
    }

    init() {
      this.setSize()
      this.setLines()
      this.tick(0)
      window.addEventListener("resize", () => this.onResize())
      window.addEventListener("mousemove", (e) => this.onMouseMove(e))
      window.addEventListener("touchmove", (e) => this.onTouchMove(e), { passive: false })
    }

    setSize() {
      this.bounding = this.container.getBoundingClientRect()
      this.canvas.width = this.bounding.width
      this.canvas.height = this.bounding.height
    }

    setLines() {
      const { width, height } = this.bounding
      this.lines = []
      const oWidth = width + 200,
        oHeight = height + 30
      const { xGap, yGap } = this.config
      const totalLines = Math.ceil(oWidth / xGap)
      const totalPoints = Math.ceil(oHeight / yGap)
      const xStart = (width - xGap * totalLines) / 2
      const yStart = (height - yGap * totalPoints) / 2

      for (let i = 0; i <= totalLines; i++) {
        const pts = []
        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          })
        }
        this.lines.push(pts)
      }
    }

    movePoints(time) {
      const { waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove } = this.config
      const { mouse, noise } = this

      this.lines.forEach((pts) => {
        pts.forEach((p) => {
          const move = noise.perlin2((p.x + time * waveSpeedX) * 0.002, (p.y + time * waveSpeedY) * 0.0015) * 12
          p.wave.x = Math.cos(move) * waveAmpX
          p.wave.y = Math.sin(move) * waveAmpY

          const dx = p.x - mouse.sx,
            dy = p.y - mouse.sy
          const dist = Math.hypot(dx, dy),
            l = Math.max(175, mouse.vs)
          if (dist < l) {
            const s = 1 - dist / l
            const f = Math.cos(dist * 0.001) * s
            p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065
            p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065
          }

          p.cursor.vx += (0 - p.cursor.x) * tension
          p.cursor.vy += (0 - p.cursor.y) * tension
          p.cursor.vx *= friction
          p.cursor.vy *= friction
          p.cursor.x += p.cursor.vx * 2
          p.cursor.y += p.cursor.vy * 2
          p.cursor.x = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.x))
          p.cursor.y = Math.min(maxCursorMove, Math.max(-maxCursorMove, p.cursor.y))
        })
      })
    }

    moved(point, withCursor = true) {
      const x = point.x + point.wave.x + (withCursor ? point.cursor.x : 0)
      const y = point.y + point.wave.y + (withCursor ? point.cursor.y : 0)
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
    }

    drawLines() {
      const { width, height } = this.bounding
      this.ctx.clearRect(0, 0, width, height)
      this.ctx.beginPath()
      this.ctx.strokeStyle = this.config.lineColor
      this.lines.forEach((points) => {
        let p1 = this.moved(points[0], false)
        this.ctx.moveTo(p1.x, p1.y)
        points.forEach((p, idx) => {
          const isLast = idx === points.length - 1
          p1 = this.moved(p, !isLast)
          const p2 = this.moved(points[idx + 1] || points[points.length - 1], !isLast)
          this.ctx.lineTo(p1.x, p1.y)
          if (isLast) this.ctx.moveTo(p2.x, p2.y)
        })
      })
      this.ctx.stroke()
    }

    tick = (t) => {
      const { mouse } = this
      mouse.sx += (mouse.x - mouse.sx) * 0.1
      mouse.sy += (mouse.y - mouse.sy) * 0.1
      const dx = mouse.x - mouse.lx,
        dy = mouse.y - mouse.ly
      const d = Math.hypot(dx, dy)
      mouse.v = d
      mouse.vs += (d - mouse.vs) * 0.1
      mouse.vs = Math.min(100, mouse.vs)
      mouse.lx = mouse.x
      mouse.ly = mouse.y
      mouse.a = Math.atan2(dy, dx)

      this.movePoints(t)
      this.drawLines()
      this.frameId = requestAnimationFrame(() => this.tick(t + 1))
    }

    onResize = () => {
      this.setSize()
      this.setLines()
    }

    onMouseMove = (e) => {
      this.updateMouse(e.clientX, e.clientY)
    }

    onTouchMove = (e) => {
      const touch = e.touches[0]
      this.updateMouse(touch.clientX, touch.clientY)
    }

    updateMouse(x, y) {
      const { mouse, bounding } = this
      mouse.x = x - bounding.left
      mouse.y = y - bounding.top
      if (!mouse.set) {
        mouse.sx = mouse.x
        mouse.sy = mouse.y
        mouse.lx = mouse.x
        mouse.ly = mouse.y
        mouse.set = true
      }
    }

    destroy() {
      cancelAnimationFrame(this.frameId)
      window.removeEventListener("resize", this.onResize)
      window.removeEventListener("mousemove", this.onMouseMove)
      window.removeEventListener("touchmove", this.onTouchMove)
    }
  }

  const electricBorder = document.querySelector(".electric-border")
  if (electricBorder) {
    const filterId = "electric-filter"
    const strokeEl = electricBorder.querySelector(".eb-stroke")
    if (strokeEl && document.getElementById(filterId)) {
      strokeEl.style.filter = `url(#${filterId})`
    }
  }

  // Initialize Waves Animation
  const waveContainer = document.querySelector(".wave-container")
  if (waveContainer) {
    new WavesAnimation(waveContainer)
  }

  class ClickSparkAnimation {
    constructor() {
      this.canvas = document.getElementById("clickSparkCanvas")
      if (!this.canvas) return

      this.ctx = this.canvas.getContext("2d")
      this.sparks = []
      this.config = {
        sparkColor: "#fff",
        sparkSize: 10,
        sparkRadius: 15,
        sparkCount: 8,
        duration: 400,
        easing: "ease-out",
      }

      this.resizeCanvas()
      this.setupEventListeners()
      this.animate()
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    }

    setupEventListeners() {
      window.addEventListener("resize", () => this.resizeCanvas())
      document.addEventListener("click", (e) => this.updateSparkColor(e.target))
      document.addEventListener("click", (e) => this.createSparks(e.clientX, e.clientY))
    }

    updateSparkColor(element) {
      let bgColor = window.getComputedStyle(element).backgroundColor
      let parent = element.parentElement

      while (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
        if (!parent) break
        bgColor = window.getComputedStyle(parent).backgroundColor
        parent = parent.parentElement
      }

      const isDark = this.isBackgroundDark(bgColor)
      this.config.sparkColor = isDark ? "#fff" : "#000"
    }

    isBackgroundDark(bgColor) {
      const rgb = bgColor.match(/\d+/g)
      if (!rgb || rgb.length < 3) return false

      const [r, g, b] = [Number.parseInt(rgb[0]), Number.parseInt(rgb[1]), Number.parseInt(rgb[2])]
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness < 128
    }

    easeFunc(t, easing = "ease-out") {
      switch (easing) {
        case "linear":
          return t
        case "ease-in":
          return t * t
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        case "ease-out":
        default:
          return t * (2 - t)
      }
    }

    createSparks(x, y) {
      const now = performance.now()
      const { sparkCount, sparkRadius } = this.config

      for (let i = 0; i < sparkCount; i++) {
        const angle = (2 * Math.PI * i) / sparkCount
        this.sparks.push({
          x,
          y,
          angle,
          startTime: now,
          life: 1,
        })
      }
    }

    animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      const now = performance.now()
      const { sparkSize, sparkRadius, duration, easing } = this.config

      this.sparks = this.sparks.filter((spark) => {
        const elapsed = now - spark.startTime
        if (elapsed >= duration) {
          return false
        }

        const progress = elapsed / duration
        const eased = this.easeFunc(progress, easing)

        const distance = eased * sparkRadius
        const lineLength = sparkSize * (1 - eased)

        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

        this.ctx.strokeStyle = this.config.sparkColor
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.stroke()

        return true
      })

      requestAnimationFrame(this.animate)
    }
  }

  // Initialize click spark animation
  new ClickSparkAnimation()
})