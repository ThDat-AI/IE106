import flet as ft
import time

def main(page: ft.Page):
    # Page Configuration
    page.title = "VibeWave | Security Protocol"
    page.window_width = 500
    page.window_height = 450
    page.window_resizable = False
    page.window_always_on_top = True
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    page.horizontal_alignment = ft.CrossAxisAlignment.CENTER
    page.bgcolor = "#0C0A09"  # Deep Onyx
    page.padding = 0
    
    # Custom Fonts
    page.fonts = {
        "FiraCode": "https://github.com/tonsky/FiraCode/raw/master/distr/ttf/FiraCode-Bold.ttf",
        "FiraSans": "https://github.com/google/fonts/raw/main/ofl/firasans/FiraSans-Regular.ttf"
    }

    def close_app(e):
        page.window_destroy()

    def simulate_deletion(e):
        # Change button state
        delete_btn.content = ft.ProgressRing(width=16, height=16, stroke_width=2, color="white")
        delete_btn.disabled = True
        page.update()
        
        # Simulate process
        time.sleep(2)
        
        # Final confirmation
        main_content.content = ft.Column(
            [
                ft.Icon(name=ft.Icons.CHECK_CIRCLE_ROUNDED, color="#10B981", size=60),
                ft.Text(
                    "ĐÃ XÓA DỮ LIỆU",
                    size=22,
                    weight=ft.FontWeight.BOLD,
                    font_family="FiraCode",
                    color="#10B981"
                ),
                ft.Text(
                    "Mọi thông tin đã được gỡ bỏ khỏi hệ thống VibeWave.",
                    size=14,
                    color="#A8A29E",
                    text_align=ft.TextAlign.CENTER
                ),
                ft.Divider(height=20, color="transparent"),
                ft.ElevatedButton(
                    "Đóng Ứng Dụng",
                    on_click=close_app,
                    bgcolor="#1C1917",
                    color="white"
                )
            ],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            alignment=ft.MainAxisAlignment.CENTER
        )
        page.update()

    # Dangerous Button with Glow Effect
    delete_btn = ft.Container(
        content=ft.Text("XÓA VĨNH VIỄN", weight=ft.FontWeight.BOLD, size=13),
        padding=ft.padding.symmetric(horizontal=25, vertical=12),
        bgcolor="#7F1D1D",  # Blood Red
        border_radius=8,
        on_click=simulate_deletion,
        alignment=ft.alignment.center,
        cursor=ft.Cursor.POINTER,
        shadow=ft.BoxShadow(
            spread_radius=1,
            blur_radius=15,
            color="#7F1D1D",
            offset=ft.Offset(0, 0),
        ),
    )

    # Main Card (Liquid Glass)
    main_content = ft.Container(
        content=ft.Column(
            [
                # Warning Icon with Pulse Animation (Simulated by layout)
                ft.Container(
                    content=ft.Icon(name=ft.Icons.GPP_MAYBE_ROUNDED, color="#CA8A04", size=50),
                    margin=ft.margin.only(bottom=10)
                ),
                ft.Text(
                    "HÀNH ĐỘNG NGUY HIỂM",
                    size=24,
                    weight=ft.FontWeight.BOLD,
                    font_family="FiraCode",
                    color="#CA8A04", # VibeWave Gold
                    text_align=ft.TextAlign.CENTER,
                ),
                ft.Text(
                    "Bạn đang yêu cầu xóa toàn bộ dữ liệu cá nhân.",
                    size=15,
                    weight=ft.FontWeight.W_500,
                    font_family="FiraSans",
                    color="#FAFAF9",
                    text_align=ft.TextAlign.CENTER,
                ),
                ft.Text(
                    "Hành động này sẽ xóa vĩnh viễn tài khoản, lịch sử nghe nhạc và các danh sách phát của bạn. Không thể hoàn tác.",
                    size=13,
                    font_family="FiraSans",
                    color="#A8A29E",
                    text_align=ft.TextAlign.CENTER,
                ),
                ft.Divider(height=30, color="#292524"),
                ft.Row(
                    [
                        ft.TextButton(
                            "Hủy Bỏ",
                            on_click=close_app,
                            style=ft.ButtonStyle(color="#A8A29E")
                        ),
                        delete_btn
                    ],
                    alignment=ft.MainAxisAlignment.CENTER,
                    spacing=20
                )
            ],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            alignment=ft.MainAxisAlignment.CENTER,
        ),
        padding=40,
        width=420,
        bgcolor="#1C1917", # Card Background
        border_radius=20,
        border=ft.border.all(1, "#44403C"),
        blur=ft.Blur(15, 15, ft.BlurTileMode.CLAMP),
    )

    # Background Decor (Liquid Orbs)
    bg_decor = ft.Stack([
        ft.Container(
            width=200, height=200,
            bgcolor="#CA8A04",
            border_radius=100,
            blur=ft.Blur(80, 80),
            left=-50, top=-50,
            opacity=0.1
        ),
        ft.Container(
            width=150, height=150,
            bgcolor="#7F1D1D",
            border_radius=100,
            blur=ft.Blur(60, 60),
            right=-30, bottom=-30,
            opacity=0.15
        )
    ])

    page.add(
        ft.Stack([
            bg_decor,
            ft.Container(
                content=main_content,
                alignment=ft.alignment.center,
                expand=True
            )
        ], expand=True)
    )

if __name__ == "__main__":
    ft.app(target=main)
