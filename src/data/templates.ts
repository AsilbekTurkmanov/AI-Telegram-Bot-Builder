import { ProjectFile } from '../types/project';

export function generateInitialFiles(
  projectName: string,
  botName: string,
  botType: string,
  language: string,
  database: string,
  features: string[],
  botToken?: string
): ProjectFile[] {
  const cleanName = projectName.replace(/[^a-zA-Z0-9]/g, '');
  const timestamp = new Date().toISOString();

  const files: ProjectFile[] = [
    // --- 1. DOMAIN LAYER ---
    {
      id: 'f1',
      path: `src/${cleanName}.Domain/Entities/User.cs`,
      name: 'User.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: `namespace ${cleanName}.Domain.Entities;

public class User
{
    public long Id { get; set; }
    public long TelegramId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string? Username { get; set; }
    public string? PhoneNumber { get; set; }
    public string LanguageCode { get; set; } = "uz";
    public string Role { get; set; } = "User"; // User, Admin
    public bool IsBlocked { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}`
    },
    {
      id: 'f2',
      path: `src/${cleanName}.Domain/Entities/Product.cs`,
      name: 'Product.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: `namespace ${cleanName}.Domain.Entities;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int Stock { get; set; } = 100;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
    },
    {
      id: 'f3',
      path: `src/${cleanName}.Domain/Entities/Order.cs`,
      name: 'Order.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: `namespace ${cleanName}.Domain.Entities;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Preparing,
    Ready,
    Delivering,
    Completed,
    Cancelled
}

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public long UserId { get; set; }
    public User User { get; set; } = null!;
    public string ItemsJson { get; set; } = string.Empty; // JSON formatted items list
    public decimal TotalAmount { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}`
    },

    // --- 2. INFRASTRUCTURE & DB ---
    {
      id: 'f4',
      path: `src/${cleanName}.Infrastructure/Persistence/AppDbContext.cs`,
      name: 'AppDbContext.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: `using Microsoft.EntityFrameworkCore;
using ${cleanName}.Domain.Entities;

namespace ${cleanName}.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.TelegramId)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);
    }
}`
    },

    // --- 3. APPLICATION & SERVICES ---
    {
      id: 'f5',
      path: `src/${cleanName}.Application/Services/OrderService.cs`,
      name: 'OrderService.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: `using Microsoft.EntityFrameworkCore;
using ${cleanName}.Domain.Entities;
using ${cleanName}.Infrastructure.Persistence;

namespace ${cleanName}.Application.Services;

public interface IOrderService
{
    Task<Order> CreateOrderAsync(long telegramId, string items, decimal total, string address, string phone);
    Task<List<Order>> GetUserOrdersAsync(long telegramId);
    Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus);
}

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Order> CreateOrderAsync(long telegramId, string items, decimal total, string address, string phone)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.TelegramId == telegramId);
        if (user == null) throw new InvalidOperationException("User not registered.");

        var order = new Order
        {
            UserId = user.Id,
            ItemsJson = items,
            TotalAmount = total,
            DeliveryAddress = address,
            ContactPhone = phone,
            Status = OrderStatus.Pending
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<List<Order>> GetUserOrdersAsync(long telegramId)
    {
        return await _db.Orders
            .Include(o => o.User)
            .Where(o => o.User.TelegramId == telegramId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
    {
        var order = await _db.Orders.FindAsync(orderId);
        if (order == null) return false;

        order.Status = newStatus;
        if (newStatus == OrderStatus.Completed)
            order.CompletedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }
}`
    },

    // --- 4. TELEGRAM BOT HANDLER ---
    {
      id: 'f6',
      path: `src/${cleanName}.Telegram/Handlers/BotUpdateHandler.cs`,
      name: 'BotUpdateHandler.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: `using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;
using ${cleanName}.Application.Services;

namespace ${cleanName}.Telegram.Handlers;

public class BotUpdateHandler
{
    private readonly ITelegramBotClient _bot;
    private readonly IOrderService _orderService;

    public BotUpdateHandler(ITelegramBotClient bot, IOrderService orderService)
    {
        _bot = bot;
        _orderService = orderService;
    }

    public async Task HandleUpdateAsync(Update update, CancellationToken cancellationToken)
    {
        if (update.Message is not { } message) return;
        if (message.Text is not { } messageText) return;

        var chatId = message.Chat.Id;

        switch (messageText.Split(' ')[0])
        {
            case "/start":
                await SendWelcomeMessageAsync(chatId, message.From?.FirstName ?? "User", cancellationToken);
                break;

            case "/menu":
            case "🍔 Menyu":
                await SendMenuAsync(chatId, cancellationToken);
                break;

            case "/orders":
            case "📦 Buyurtmalarim":
                await SendOrdersAsync(chatId, message.From?.Id ?? 0, cancellationToken);
                break;

            default:
                await _bot.SendMessage(chatId, "Kechirasiz, buyruq tushunilmadi. /start tugmasini bosing.", cancellationToken: cancellationToken);
                break;
        }
    }

    private async Task SendWelcomeMessageAsync(long chatId, string name, CancellationToken cancellationToken)
    {
        var keyboard = new ReplyKeyboardMarkup(new[]
        {
            new KeyboardButton[] { "🍔 Menyu", "🛒 Savat" },
            new KeyboardButton[] { "📦 Buyurtmalarim", "👤 Profil" }
        })
        {
            ResizeKeyboard = true
        };

        await _bot.SendMessage(
            chatId: chatId,
            text: $"Assalomu alaykum, {name}! **{${JSON.stringify(botName)}}** ga xush kelibsiz!\\nNimadan boshlaymiz?",
            replyMarkup: keyboard,
            cancellationToken: cancellationToken
        );
    }

    private async Task SendMenuAsync(long chatId, CancellationToken cancellationToken)
    {
        var inlineKeyboard = new InlineKeyboardMarkup(new[]
        {
            new[] { InlineKeyboardButton.WithCallbackData("🍔 Osh (35,000 UZS)", "add_osh") },
            new[] { InlineKeyboardButton.WithCallbackData("🍕 Pitsa (65,000 UZS)", "add_pitsa") },
            new[] { InlineKeyboardButton.WithCallbackData("🥤 Koka-Kola (12,000 UZS)", "add_cola") },
            new[] { InlineKeyboardButton.WithCallbackData("🛒 Savatni korish", "view_cart") }
        });

        await _bot.SendMessage(
            chatId: chatId,
            text: "📋 **Bizning Mazali Menyu:**\\nMahsulot tanlang:",
            replyMarkup: inlineKeyboard,
            cancellationToken: cancellationToken
        );
    }

    private async Task SendOrdersAsync(long chatId, long telegramId, CancellationToken cancellationToken)
    {
        var orders = await _orderService.GetUserOrdersAsync(telegramId);
        if (orders.Count == 0)
        {
            await _bot.SendMessage(chatId, "Sizda hali aktiv buyurtmalar yo'q.", cancellationToken: cancellationToken);
            return;
        }

        var text = "📦 **Sizning oxirgi buyurtmalaringiz:**\\n\\n" + 
            string.Join("\\n", orders.Select(o => $"# {o.Id.ToString()[..8]} | Status: **{o.Status}** | Jami: {o.TotalAmount:N0} UZS"));

        await _bot.SendMessage(chatId, text, cancellationToken: cancellationToken);
    }
}`
    },

    // --- 5. WEB API CONTROLLER ---
    {
      id: 'f7',
      path: `src/${cleanName}.Api/Controllers/OrdersController.cs`,
      name: 'OrdersController.cs',
      language: 'csharp',
      version: 1,
      modifiedAt: timestamp,
      content: `using Microsoft.AspNetCore.Mvc;
using ${cleanName}.Application.Services;
using ${cleanName}.Domain.Entities;

namespace ${cleanName}.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("user/{telegramId}")]
    public async Task<IActionResult> GetUserOrders(long telegramId)
    {
        var orders = await _orderService.GetUserOrdersAsync(telegramId);
        return Ok(orders);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] OrderStatus status)
    {
        var success = await _orderService.UpdateOrderStatusAsync(id, status);
        if (!success) return NotFound(new { message = "Order not found" });
        return Ok(new { success = true, newStatus = status.ToString() });
    }
}`
    },

    // --- 6. REACT ADMIN PANEL ---
    {
      id: 'f8',
      path: `admin/src/App.tsx`,
      name: 'App.tsx (Admin UI)',
      language: 'typescript',
      version: 1,
      modifiedAt: timestamp,
      content: `import React, { useState } from 'react';
import { ShoppingBag, Users, Send, BarChart2, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'users' | 'broadcast'>('orders');

  return (
    <div className="admin-container style={{ background: '#0f172a', color: '#fff', minHeight: '100vh', padding: '24px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🤖 ${botName} — Admin Dashboard</h1>
        <p style={{ color: '#94a3b8' }}>Real-time bot monitoring & management</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Jami Foydalanuvchilar</span>
          <h2 style={{ fontSize: '28px', color: '#38bdf8' }}>1,248</h2>
        </div>
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Bugungi Buyurtmalar</span>
          <h2 style={{ fontSize: '28px', color: '#4ade80' }}>42</h2>
        </div>
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Kutilayotgan</span>
          <h2 style={{ fontSize: '28px', color: '#facc15' }}>7</h2>
        </div>
        <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Jami Tushum</span>
          <h2 style={{ fontSize: '28px', color: '#c084fc' }}>14,580,000 UZS</h2>
        </div>
      </div>
    </div>
  );
}`
    },

    // --- 7. DOCKER & DOCKER-COMPOSE ---
    {
      id: 'f9',
      path: `docker-compose.yml`,
      name: 'docker-compose.yml',
      language: 'dockerfile',
      version: 1,
      modifiedAt: timestamp,
      content: `version: '3.8'

services:
  bot-api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__Default=Host=postgres;Database=${cleanName}Db;Username=postgres;Password=SecretPassword123
      - Redis__ConnectionString=redis:6379
      - Telegram__BotToken=\${TELEGRAM_BOT_TOKEN}
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${cleanName}Db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: SecretPassword123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:`
    },
    {
      id: 'f10',
      path: `Dockerfile`,
      name: 'Dockerfile',
      language: 'dockerfile',
      version: 1,
      modifiedAt: timestamp,
      content: `FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["src/${cleanName}.Api/${cleanName}.Api.csproj", "${cleanName}.Api/"]
RUN dotnet restore "${cleanName}.Api/${cleanName}.Api.csproj"
COPY . .
WORKDIR "/src/src/${cleanName}.Api"
RUN dotnet build "${cleanName}.Api.csproj" -c Release -o /app/build
RUN dotnet publish "${cleanName}.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "${cleanName}.Api.dll"]`
    },

    // --- 8. DOCUMENTATION & CONFIG ---
    {
      id: 'f11',
      path: `.env`,
      name: '.env',
      language: 'plaintext',
      version: 1,
      modifiedAt: timestamp,
      content: `# Telegram Bot Token from @BotFather
TELEGRAM_BOT_TOKEN=${botToken || '7182940124:AAEk921jklMNOpqrSTUvwxYZ_sample'}

# Database connection string
ConnectionStrings__Default=Host=localhost;Database=${cleanName}Db;Username=postgres;Password=your_secure_password

# Redis caching
Redis__ConnectionString=localhost:6379

# JWT Auth Secret
Jwt__Secret=SuperSecretKeyThatIsAtLeast32BytesLongForSecurity123!`
    },
    {
      id: 'f12',
      path: `.env.example`,
      name: '.env.example',
      language: 'plaintext',
      version: 1,
      modifiedAt: timestamp,
      content: `# Telegram Bot Token from @BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ

# Database connection string
ConnectionStrings__Default=Host=localhost;Database=${cleanName}Db;Username=postgres;Password=your_secure_password

# Redis caching
Redis__ConnectionString=localhost:6379

# JWT Auth Secret
Jwt__Secret=SuperSecretKeyThatIsAtLeast32BytesLongForSecurity123!`
    },
    {
      id: 'f13',
      path: `README.md`,
      name: 'README.md',
      language: 'markdown',
      version: 1,
      modifiedAt: timestamp,
      content: `# 🤖 ${botName} — Generated Telegram Bot Solution

Powered by **AI Telegram Bot Builder** using **ASP.NET Core .NET 10 Clean Architecture**, **PostgreSQL**, **Redis**, and **React Admin Panel**.

## 🚀 Quick Start Guide

### 1. Environment Setup
Bot token is configured in \`.env\`:
\`\`\`bash
TELEGRAM_BOT_TOKEN=${botToken || 'your_bot_token_here'}
\`\`\`

### 2. Run with Docker Compose
\`\`\`bash
docker compose up -d --build
\`\`\`

### 3. Manual Local Launch (.NET 10)
\`\`\`bash
# Start Database & Redis
docker compose up -d postgres redis

# Run EF Core Migrations
dotnet ef database update --project src/${cleanName}.Infrastructure

# Start Backend API & Telegram Bot Listener
dotnet run --project src/${cleanName}.Api
\`\`\`

### 4. Admin Panel
\`\`\`bash
cd admin
npm install
npm run dev
\`\`\`

---
Generated on ${new Date().toLocaleDateString()} | Clean Architecture & SOLID Compliant.`
    }
  ];

  return files;
}
