/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "ScreenHelperGTK.h"

#ifdef MOZ_X11
#  include <gdk/gdkx.h>
#endif /* MOZ_X11 */
#ifdef MOZ_WAYLAND
#  include <gdk/gdkwayland.h>
#endif /* MOZ_WAYLAND */
#include <dlfcn.h>
#include <gtk/gtk.h>

#include "gfxPlatformGtk.h"
#include "mozilla/dom/DOMTypes.h"
#include "mozilla/Logging.h"
#include "mozilla/WidgetUtilsGtk.h"
#include "nsGtkUtils.h"
#include "nsTArray.h"

namespace mozilla {
namespace widget {

static LazyLogModule sScreenLog("WidgetScreen");

static void monitors_changed(GdkScreen* aScreen, gpointer aClosure) {
  MOZ_LOG(sScreenLog, LogLevel::Debug, ("Received monitors-changed event"));
  ScreenGetterGtk* self = static_cast<ScreenGetterGtk*>(aClosure);
  self->RefreshScreens();
}

static void screen_resolution_changed(GdkScreen* aScreen, GParamSpec* aPspec,
                                      ScreenGetterGtk* self) {
  self->RefreshScreens();
}

static GdkFilterReturn root_window_event_filter(GdkXEvent* aGdkXEvent,
                                                GdkEvent* aGdkEvent,
                                                gpointer aClosure) {
#ifdef MOZ_X11
  ScreenGetterGtk* self = static_cast<ScreenGetterGtk*>(aClosure);
  XEvent* xevent = static_cast<XEvent*>(aGdkXEvent);

  switch (xevent->type) {
    case PropertyNotify: {
      XPropertyEvent* propertyEvent = &xevent->xproperty;
      if (propertyEvent->atom == self->NetWorkareaAtom()) {
        MOZ_LOG(sScreenLog, LogLevel::Debug, ("Work area size changed"));
        self->RefreshScreens();
      }
    } break;
    default:
      break;
  }
#endif

  return GDK_FILTER_CONTINUE;
}

ScreenGetterGtk::ScreenGetterGtk()
    : mRootWindow(nullptr)
#ifdef MOZ_X11
      ,
      mNetWorkareaAtom(0)
#endif
{
  MOZ_LOG(sScreenLog, LogLevel::Debug, ("ScreenGetterGtk created"));
  GdkScreen* defaultScreen = gdk_screen_get_default();
  if (!defaultScreen) {
    // Sometimes we don't initial X (e.g., xpcshell)
    MOZ_LOG(sScreenLog, LogLevel::Debug,
            ("defaultScreen is nullptr, running headless"));
    return;
  }
  mRootWindow = gdk_get_default_root_window();
  MOZ_ASSERT(mRootWindow);

  g_object_ref(mRootWindow);

  // GDK_PROPERTY_CHANGE_MASK ==> PropertyChangeMask, for PropertyNotify
  gdk_window_set_events(mRootWindow,
                        GdkEventMask(gdk_window_get_events(mRootWindow) |
                                     GDK_PROPERTY_CHANGE_MASK));

  g_signal_connect(defaultScreen, "monitors-changed",
                   G_CALLBACK(monitors_changed), this);
  // Use _after to ensure this callback is run after gfxPlatformGtk.cpp's
  // handler.
  g_signal_connect_after(defaultScreen, "notify::resolution",
                         G_CALLBACK(screen_resolution_changed), this);
#ifdef MOZ_X11
  gdk_window_add_filter(mRootWindow, root_window_event_filter, this);
  if (GdkIsX11Display()) {
    mNetWorkareaAtom = XInternAtom(GDK_WINDOW_XDISPLAY(mRootWindow),
                                   "_NET_WORKAREA", X11False);
  }
#endif
  RefreshScreens();
}

ScreenGetterGtk::~ScreenGetterGtk() {
  if (mRootWindow) {
    g_signal_handlers_disconnect_by_data(gdk_screen_get_default(), this);

    gdk_window_remove_filter(mRootWindow, root_window_event_filter, this);
    g_object_unref(mRootWindow);
    mRootWindow = nullptr;
  }
}

static uint32_t GetGTKPixelDepth() {
  GdkVisual* visual = gdk_screen_get_system_visual(gdk_screen_get_default());
  return gdk_visual_get_depth(visual);
}

static already_AddRefed<Screen> MakeScreenGtk(GdkScreen* aScreen,
                                              gint aMonitorNum) {
  GdkRectangle monitor;
  GdkRectangle workarea;
  gdk_screen_get_monitor_geometry(aScreen, aMonitorNum, &monitor);
  gdk_screen_get_monitor_workarea(aScreen, aMonitorNum, &workarea);
  gint gdkScaleFactor = ScreenHelperGTK::GetGTKMonitorScaleFactor(aMonitorNum);

  // gdk_screen_get_monitor_geometry / workarea returns application pixels
  // (desktop pixels), so we need to convert it to device pixels with
  // gdkScaleFactor on X11.
  gint geometryScaleFactor = 1;
  if (GdkIsX11Display()) {
    geometryScaleFactor = gdkScaleFactor;
  }

  LayoutDeviceIntRect rect(monitor.x * geometryScaleFactor,
                           monitor.y * geometryScaleFactor,
                           monitor.width * geometryScaleFactor,
                           monitor.height * geometryScaleFactor);
  LayoutDeviceIntRect availRect(workarea.x * geometryScaleFactor,
                                workarea.y * geometryScaleFactor,
                                workarea.width * geometryScaleFactor,
                                workarea.height * geometryScaleFactor);

  uint32_t pixelDepth = GetGTKPixelDepth();

  // Use per-monitor scaling factor in gtk/wayland, or 1.0 otherwise.
  DesktopToLayoutDeviceScale contentsScale(1.0);
#ifdef MOZ_WAYLAND
  if (GdkIsWaylandDisplay()) {
    contentsScale.scale = gdkScaleFactor;
  }
#endif

  CSSToLayoutDeviceScale defaultCssScale(gdkScaleFactor *
                                         gfxPlatformGtk::GetFontScaleFactor());

  float dpi = 96.0f;
  gint heightMM = gdk_screen_get_monitor_height_mm(aScreen, aMonitorNum);
  if (heightMM > 0) {
    dpi = rect.height / (heightMM / MM_PER_INCH_FLOAT);
  }

  MOZ_LOG(sScreenLog, LogLevel::Debug,
          ("New screen [%d %d %d %d (%d %d %d %d) %d %f %f %f]", rect.x, rect.y,
           rect.width, rect.height, availRect.x, availRect.y, availRect.width,
           availRect.height, pixelDepth, contentsScale.scale,
           defaultCssScale.scale, dpi));
  RefPtr<Screen> screen = new Screen(rect, availRect, pixelDepth, pixelDepth,
                                     contentsScale, defaultCssScale, dpi);
  return screen.forget();
}

void ScreenGetterGtk::RefreshScreens() {
  MOZ_LOG(sScreenLog, LogLevel::Debug, ("Refreshing screens"));
  AutoTArray<RefPtr<Screen>, 4> screenList;

  GdkScreen* defaultScreen = gdk_screen_get_default();
  gint numScreens = gdk_screen_get_n_monitors(defaultScreen);
  MOZ_LOG(sScreenLog, LogLevel::Debug, ("GDK reports %d screens", numScreens));

  for (gint i = 0; i < numScreens; i++) {
    screenList.AppendElement(MakeScreenGtk(defaultScreen, i));
  }

  ScreenManager& screenManager = ScreenManager::GetSingleton();
  screenManager.Refresh(std::move(screenList));
}

gint ScreenHelperGTK::GetGTKMonitorScaleFactor(gint aMonitorNum) {
  GdkScreen* screen = gdk_screen_get_default();
  return gdk_screen_get_monitor_scale_factor(screen, aMonitorNum);
}

ScreenHelperGTK::ScreenHelperGTK() : mGetter() {
  mGetter = mozilla::MakeUnique<ScreenGetterGtk>();
}

}  // namespace widget
}  // namespace mozilla
