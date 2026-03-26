#include <math.h>

double calc_add      (double a, double b) { 
    return a + b;
}

double calc_subtract (double a, double b) { 
    return a - b;
}

double calc_multiply (double a, double b) { 
    return a * b;
}

double calc_divide  (double a, double b) { 
    return a / b; 
} 

/* power operation (a^b) */
double calc_power   (double a, double b) {
    return pow(a, b);
}

/* modulo operation (a % b) */
double calc_modulo  (double a, double b) {
    return (int)a % (int)b;
}