#include <gtk/gtk.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <math.h>
#include "calculator.h"

GtkWidget *display;
GtkWidget *expr_label;
GtkWidget *sci_row;

double num1    = 0;
char   op      = '\0';
int    has_num1 = 0;

void click(GtkButton *btn, gpointer data) {
    (void)data;
    const char *key = gtk_button_get_label(btn);
    char k = key[0];

    char buf[256];
    strncpy(buf, gtk_entry_get_text(GTK_ENTRY(display)), sizeof(buf) - 1);
    int len = strlen(buf);

    if (k == 'C') {
        gtk_entry_set_text(GTK_ENTRY(display), "");
        gtk_label_set_text(GTK_LABEL(expr_label), "");
        num1 = 0; op = '\0'; has_num1 = 0;

    } else if (strcmp(key, "\xe2\x86\x90") == 0) {        /* <- */
        if (len > 0) { buf[len-1] = '\0'; gtk_entry_set_text(GTK_ENTRY(display), buf); }

    } else if (strcmp(key, "More") == 0) {
        if (gtk_widget_get_visible(sci_row)) gtk_widget_hide(sci_row);
        else gtk_widget_show_all(sci_row);

    } else if (strcmp(key, "\xcf\x80") == 0) {            /* pi */
        gtk_entry_set_text(GTK_ENTRY(display), "3.14159265358979");

    } else if (strcmp(key,"sin")==0 || strcmp(key,"cos")==0 || strcmp(key,"tan")==0
            || strcmp(key,"log")==0 || strcmp(key,"ln")==0) {
        if (len == 0) return;
        double val = atof(buf), result = 0;
        if      (strcmp(key,"sin")==0) result = sin(val * M_PI / 180.0);
        else if (strcmp(key,"cos")==0) result = cos(val * M_PI / 180.0);
        else if (strcmp(key,"tan")==0) result = tan(val * M_PI / 180.0);
        else if (strcmp(key,"log")==0) result = log10(val);
        else if (strcmp(key,"ln") ==0) result = log(val);
        char out[64];
        snprintf(out, sizeof(out), result == (int)result ? "%.0f" : "%g", result);
        gtk_entry_set_text(GTK_ENTRY(display), out);
        gtk_label_set_text(GTK_LABEL(expr_label), "");

    } else if (k == '+' || k == '-' || k == '^' || k == '%'
            || strcmp(key, "\xc3\xb7") == 0                /* div */
            || strcmp(key, "\xc3\x97") == 0) {             /* mul */
        if (len == 0) return;
        num1 = atof(buf);
        op   = (strcmp(key,"\xc3\xb7")==0) ? '/' :
               (strcmp(key,"\xc3\x97")==0) ? '*' : k;
        has_num1 = 1;
        char expr[64];
        snprintf(expr, sizeof(expr), "%s %s", buf, key);  /* e.g. "5 +" */
        gtk_label_set_text(GTK_LABEL(expr_label), expr);
        gtk_entry_set_text(GTK_ENTRY(display), "");

    } else if (k == '=') {
        if (!has_num1 || op == '\0' || len == 0) return;
        double b = atof(buf), result = 0;
        switch (op) {
            case '+': result = calc_add     (num1, b); break;
            case '-': result = calc_subtract(num1, b); break;
            case '*': result = calc_multiply(num1, b); break;
            case '/': result = calc_divide  (num1, b); break;
            case '^': result = calc_power   (num1, b); break;
            case '%': result = calc_modulo  (num1, b); break;
        }
        char out[64];
        snprintf(out, sizeof(out), result == (int)result ? "%.0f" : "%g", result);
        gtk_entry_set_text(GTK_ENTRY(display), out);
        gtk_label_set_text(GTK_LABEL(expr_label), "");
        num1 = result; op = '\0'; has_num1 = 0;

    } else if (k == '.' && strchr(buf, '.')) {
        return;

    } else if (len < 20) {
        buf[len] = k; buf[len+1] = '\0';
        gtk_entry_set_text(GTK_ENTRY(display), buf);
    }
}

void make_btn(const char *label, GtkGrid *grid, int row, int col, int span) {
    const char *bg =
        strcmp(label,"=")    == 0                        ? "#B1E3F7" :
        strcmp(label,"C")    == 0 ||
        strcmp(label,"\xe2\x86\x90") == 0                ? "#f4d836" :
        strcmp(label,"More") == 0                        ? "#7EC8E3" :
        label[0]=='+' || label[0]=='-' ||
        label[0]=='^' || label[0]=='%' ||
        strcmp(label,"\xc3\x97")==0 ||
        strcmp(label,"\xc3\xb7")==0                      ? "#E61CF4" :
        strcmp(label,"sin")==0 || strcmp(label,"cos")==0 ||
        strcmp(label,"tan")==0 || strcmp(label,"log")==0 ||
        strcmp(label,"ln") ==0 ||
        strcmp(label,"\xcf\x80")==0                      ? "#A78BFA" : "#f8a4da";

    GtkWidget *btn = gtk_button_new_with_label(label);
    char css[200];
    snprintf(css, sizeof(css),
        "button{background:%s;color:%s;font-size:20px;font-weight:bold;padding:6px;}",
        bg, strcmp(bg,"#f8a4da")==0 ? "#333" : "#fff");
    GtkCssProvider *p = gtk_css_provider_new();
    gtk_css_provider_load_from_data(p, css, -1, NULL);
    gtk_style_context_add_provider(gtk_widget_get_style_context(btn),
        GTK_STYLE_PROVIDER(p), GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);
    g_object_unref(p);

    g_signal_connect(btn, "clicked", G_CALLBACK(click), NULL);
    gtk_widget_set_hexpand(btn, TRUE);
    gtk_widget_set_vexpand(btn, TRUE);
    gtk_grid_attach(grid, btn, col, row, span, 1);
}

int main(int argc, char *argv[]) {
    gtk_init(&argc, &argv);

    GtkWidget *win = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    gtk_window_set_title(GTK_WINDOW(win), "Calculator");
    gtk_window_set_default_size(GTK_WINDOW(win), 400, 560);
    gtk_window_set_resizable(GTK_WINDOW(win), FALSE);
    g_signal_connect(win, "destroy", G_CALLBACK(gtk_main_quit), NULL);

    GtkWidget *vbox = gtk_box_new(GTK_ORIENTATION_VERTICAL, 6);
    gtk_container_set_border_width(GTK_CONTAINER(vbox), 10);
    gtk_container_add(GTK_CONTAINER(win), vbox);

    /* expression label - shows "5 +" while entering second number */
    expr_label = gtk_label_new("");
    gtk_label_set_xalign(GTK_LABEL(expr_label), 1.0f);
    gtk_box_pack_start(GTK_BOX(vbox), expr_label, FALSE, FALSE, 0);

    /* bigger display */
    display = gtk_entry_new();
    gtk_entry_set_alignment(GTK_ENTRY(display), 1.0f);
    gtk_widget_set_size_request(display, -1, 70);
    GtkCssProvider *dp = gtk_css_provider_new();
    gtk_css_provider_load_from_data(dp, "entry{font-size:32px;font-weight:bold;padding:8px;}", -1, NULL);
    gtk_style_context_add_provider(gtk_widget_get_style_context(display),
        GTK_STYLE_PROVIDER(dp), GTK_STYLE_PROVIDER_PRIORITY_APPLICATION);
    g_object_unref(dp);
    gtk_box_pack_start(GTK_BOX(vbox), display, FALSE, FALSE, 4);

    /* main button grid */
    GtkWidget *grid = gtk_grid_new();
    gtk_grid_set_row_spacing(GTK_GRID(grid), 5);
    gtk_grid_set_column_spacing(GTK_GRID(grid), 5);
    gtk_box_pack_start(GTK_BOX(vbox), grid, TRUE, TRUE, 0);

    const char *btns[] = {
        "7","8","9","\xc3\xb7",
        "4","5","6","\xc3\x97",
        "1","2","3","-",
        "0",".",  "=","+",
        "^","%",  "C","\xe2\x86\x90"
    };
    for (int i = 0; i < 20; i++)
        make_btn(btns[i], GTK_GRID(grid), i/4, i%4, 1);

    make_btn("More", GTK_GRID(grid), 5, 0, 4);   /* spans all 4 columns */

    /* scientific row - hidden by default */
    sci_row = gtk_grid_new();
    gtk_grid_set_row_spacing(GTK_GRID(sci_row), 5);
    gtk_grid_set_column_spacing(GTK_GRID(sci_row), 5);
    gtk_box_pack_start(GTK_BOX(vbox), sci_row, FALSE, FALSE, 0);

    const char *sci[] = { "sin","cos","tan","log","ln","\xcf\x80" };
    for (int i = 0; i < 6; i++)
        make_btn(sci[i], GTK_GRID(sci_row), 0, i, 1);

    gtk_widget_show_all(win);
    gtk_widget_hide(sci_row);
    gtk_main();
    return 0;
}