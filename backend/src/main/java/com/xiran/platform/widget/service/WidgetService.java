package com.xiran.platform.widget.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiran.platform.widget.dto.WeatherResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 首页小组件服务：平台入口 / 实用工具 / 世界时间 / 天气
 *
 * - getWidgets()：平台入口 + 实用工具列表，静态返回。
 * - getWorldClock()：用 java.time 返回北京/伦敦/华盛顿三地当前时间。
 * - getWeather(city)：后端代理 open-meteo；外网不可达时优雅降级为固定兜底数据，绝不抛 500。
 */
@Slf4j
@Service
public class WidgetService {

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private static final String OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

    /** 腾讯行情接口（免费、无需密钥，返回 GBK 编码文本） */
    private static final String MARKET_URL = "https://qt.gtimg.cn/q=sh000001,usIXIC,usINX";

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /** 城市配置：key -> (中文名, 国家, 时区, 纬度, 经度) */
    private static final Map<String, CityConfig> CITIES = new LinkedHashMap<>();

    /** WMO weather code -> (中文描述, emoji) */
    private static final Map<Integer, String[]> WEATHER_MAP = new HashMap<>();

    /** 外网不可达时的固定兜底天气数据（不随请求变化，保证接口稳定） */
    private static final Map<String, WeatherResponse> FALLBACK_WEATHER = new HashMap<>();

    static {
        CITIES.put("beijing", new CityConfig("beijing", "北京", "中国", "Asia/Shanghai", 39.9042, 116.4074));
        CITIES.put("london", new CityConfig("london", "伦敦", "英国", "Europe/London", 51.5074, -0.1278));
        CITIES.put("washington", new CityConfig("washington", "华盛顿", "美国", "America/New_York", 38.9072, -77.0369));

        WEATHER_MAP.put(0, new String[]{"晴", "☀️"});
        WEATHER_MAP.put(1, new String[]{"基本晴朗", "🌤️"});
        WEATHER_MAP.put(2, new String[]{"局部多云", "⛅"});
        WEATHER_MAP.put(3, new String[]{"阴天", "☁️"});
        WEATHER_MAP.put(45, new String[]{"雾", "🌫️"});
        WEATHER_MAP.put(48, new String[]{"雾凇", "🌫️"});
        WEATHER_MAP.put(51, new String[]{"毛毛雨", "🌦️"});
        WEATHER_MAP.put(53, new String[]{"毛毛雨", "🌦️"});
        WEATHER_MAP.put(55, new String[]{"毛毛雨", "🌦️"});
        WEATHER_MAP.put(56, new String[]{"冻毛毛雨", "🌦️"});
        WEATHER_MAP.put(57, new String[]{"冻毛毛雨", "🌦️"});
        WEATHER_MAP.put(61, new String[]{"小雨", "🌧️"});
        WEATHER_MAP.put(63, new String[]{"中雨", "🌧️"});
        WEATHER_MAP.put(65, new String[]{"大雨", "🌧️"});
        WEATHER_MAP.put(66, new String[]{"冻雨", "🌧️"});
        WEATHER_MAP.put(67, new String[]{"冻雨", "🌧️"});
        WEATHER_MAP.put(71, new String[]{"小雪", "❄️"});
        WEATHER_MAP.put(73, new String[]{"中雪", "❄️"});
        WEATHER_MAP.put(75, new String[]{"大雪", "❄️"});
        WEATHER_MAP.put(77, new String[]{"雪粒", "❄️"});
        WEATHER_MAP.put(80, new String[]{"阵雨", "🌧️"});
        WEATHER_MAP.put(81, new String[]{"阵雨", "🌧️"});
        WEATHER_MAP.put(82, new String[]{"强阵雨", "⛈️"});
        WEATHER_MAP.put(85, new String[]{"阵雪", "❄️"});
        WEATHER_MAP.put(86, new String[]{"强阵雪", "❄️"});
        WEATHER_MAP.put(95, new String[]{"雷暴", "⛈️"});
        WEATHER_MAP.put(96, new String[]{"雷暴伴冰雹", "⛈️"});
        WEATHER_MAP.put(99, new String[]{"强雷暴伴冰雹", "⛈️"});

        // 兜底天气（固定值，source=fallback），仅当外网不可达时使用
        FALLBACK_WEATHER.put("beijing", new WeatherResponse("beijing", "北京", "中国",
                26.0, "°C", 0, "晴", "☀️", 8.0, "fallback", "2026-08-30 12:00:00"));
        FALLBACK_WEATHER.put("london", new WeatherResponse("london", "伦敦", "英国",
                15.0, "°C", 2, "局部多云", "⛅", 12.0, "fallback", "2026-08-30 12:00:00"));
        FALLBACK_WEATHER.put("washington", new WeatherResponse("washington", "华盛顿", "美国",
                22.0, "°C", 1, "基本晴朗", "🌤️", 10.0, "fallback", "2026-08-30 12:00:00"));
    }

    /**
     * 平台入口 + 实用工具列表（静态数据，与业务表无关）
     */
    public Map<String, Object> getWidgets() {
        List<Map<String, Object>> platforms = List.of(
                Map.of("key", "csandbox", "name", "代码运行平台", "subtitle", "C-Sandbox",
                        "description", "轻量级 C 语言在线编译环境，打开即写，适合快速验证想法、调试片段和记录实验结果。",
                        "href", "https://xiranya.cn/csandbox/", "icon", "⚡"),
                Map.of("key", "halo", "name", "Halo 博客", "subtitle", "技术博客",
                        "description", "基于 Halo 构建的个人技术博客，记录编译器、前后端工程、系统优化和持续学习的过程。",
                        "href", "https://halo.xiranya.cn/", "icon", "📚"),
                Map.of("key", "myblogs", "name", "简单博客", "subtitle", "随笔小站",
                        "description", "一个可以随手写日记、记录想法和沉淀生活片段的私人写作空间。",
                        "href", "https://xiranya.cn/myblogs/", "icon", "✍️"));

        List<Map<String, Object>> utilities = List.of(
                Map.of("key", "timestamp", "name", "时间戳转换", "description", "Unix 时间戳与日期时间互转", "icon", "⏱️"),
                Map.of("key", "base64", "name", "Base64 编解码", "description", "文本与 Base64 字符串互转", "icon", "🔤"),
                Map.of("key", "json", "name", "JSON 格式化", "description", "压缩 JSON 美化排版并校验合法性", "icon", "🧩"),
                Map.of("key", "password", "name", "随机密码", "description", "一键生成高强度随机密码", "icon", "🔑"),
                Map.of("key", "color", "name", "颜色转换", "description", "HEX / RGB / HSL 颜色格式互转", "icon", "🎨"));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("platforms", platforms);
        data.put("utilities", utilities);
        return data;
    }

    /**
     * 北京 / 伦敦 / 华盛顿三地当前时间（java.time，按各城市时区）
     */
    public Map<String, Object> getWorldClock() {
        Instant now = Instant.now();
        List<Map<String, Object>> cities = new ArrayList<>();
        for (CityConfig city : CITIES.values()) {
            ZoneId zone = ZoneId.of(city.timezone());
            ZonedDateTime zdt = now.atZone(zone);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("key", city.key());
            item.put("city", city.name());
            item.put("country", city.country());
            item.put("timezone", city.timezone());
            item.put("localTime", zdt.format(TIME_FORMATTER));
            item.put("utcOffset", zdt.getOffset().getId());
            cities.add(item);
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("updatedAt", now.toEpochMilli());
        data.put("cities", cities);
        return data;
    }

    /**
     * 指定城市当前天气。
     * 先尝试代理 open-meteo；失败或超时则返回固定兜底数据，接口绝不抛 500。
     */
    public WeatherResponse getWeather(String city) {
        CityConfig config = CITIES.getOrDefault(city, CITIES.get("beijing"));
        WeatherResponse remote = fetchFromOpenMeteo(config);
        if (remote != null) {
            return remote;
        }
        WeatherResponse fallback = FALLBACK_WEATHER.get(config.key());
        return fallback != null ? fallback : FALLBACK_WEATHER.get("beijing");
    }

    /**
     * 三大股指实时行情（腾讯行情代理）：上证指数 / 纳斯达克 / 标普 500。
     * 外网不可达时返回兜底快照（source=fallback），接口绝不抛 500。
     */
    public List<Map<String, Object>> getMarkets() {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(3))
                    .build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(MARKET_URL))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();
            HttpResponse<byte[]> response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() == 200) {
                String text = new String(response.body(), "GBK");
                List<Map<String, Object>> list = parseMarketText(text);
                if (!list.isEmpty()) {
                    return list;
                }
            }
            log.warn("[widget] 行情接口非 200: status={}", response.statusCode());
        } catch (Exception e) {
            log.warn("[widget] 行情接口异常，切换兜底: {}", e.getMessage());
        }
        return fallbackMarkets();
    }

    /**
     * 解析腾讯行情文本：v_sh000001="1~上证指数~000001~现价~昨收~...";
     * 取 [1] 名称、[3] 现价、[4] 昨收，自行计算涨跌额与涨跌幅。
     */
    private List<Map<String, Object>> parseMarketText(String text) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (String line : text.split(";")) {
            int start = line.indexOf('"');
            int end = line.lastIndexOf('"');
            if (start < 0 || end <= start) {
                continue;
            }
            String[] parts = line.substring(start + 1, end).split("~");
            if (parts.length < 5 || parts[3].isEmpty() || parts[4].isEmpty()) {
                continue;
            }
            try {
                double price = Double.parseDouble(parts[3]);
                double prevClose = Double.parseDouble(parts[4]);
                double change = price - prevClose;
                double changePct = prevClose == 0 ? 0 : change / prevClose * 100;
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("name", parts[1]);
                item.put("code", parts[2]);
                item.put("price", price);
                item.put("change", Math.round(change * 100.0) / 100.0);
                item.put("changePct", Math.round(changePct * 100.0) / 100.0);
                item.put("source", "tencent");
                list.add(item);
            } catch (NumberFormatException ignore) {
                // 跳过无法解析的行
            }
        }
        return list;
    }

    private List<Map<String, Object>> fallbackMarkets() {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(Map.of("name", "上证指数", "code", "000001", "price", 0, "change", 0, "changePct", 0, "source", "fallback"));
        list.add(Map.of("name", "纳斯达克", "code", ".IXIC", "price", 0, "change", 0, "changePct", 0, "source", "fallback"));
        list.add(Map.of("name", "标普500", "code", ".INX", "price", 0, "change", 0, "changePct", 0, "source", "fallback"));
        return list;
    }

    /**
     * 调用 open-meteo 获取实时天气；任何异常返回 null（由调用方降级）。
     */
    private WeatherResponse fetchFromOpenMeteo(CityConfig config) {
        try {
            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(3))
                    .build();
            String url = String.format("%s?latitude=%.4f&longitude=%.4f&current_weather=true&timezone=%s",
                    OPEN_METEO_URL, config.lat(), config.lon(), config.timezone());
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                log.warn("[widget] open-meteo 非 200 响应: status={}", response.statusCode());
                return null;
            }
            JsonNode root = OBJECT_MAPPER.readTree(response.body());
            JsonNode current = root.path("current_weather");
            if (current.isMissingNode()) {
                log.warn("[widget] open-meteo 响应缺少 current_weather");
                return null;
            }
            int weatherCode = current.path("weathercode").asInt(0);
            String[] desc = WEATHER_MAP.getOrDefault(weatherCode, new String[]{"未知", "🌡️"});
            return new WeatherResponse(
                    config.key(),
                    config.name(),
                    config.country(),
                    current.path("temperature").asDouble(0),
                    "°C",
                    weatherCode,
                    desc[0],
                    desc[1],
                    current.path("windspeed").asDouble(0),
                    "open-meteo",
                    current.path("time").asText(""));
        } catch (Exception e) {
            log.warn("[widget] open-meteo 调用异常，切换兜底: {}", e.getMessage());
            return null;
        }
    }

    /** 城市静态配置 */
    private record CityConfig(String key, String name, String country,
                              String timezone, double lat, double lon) {
    }
}
