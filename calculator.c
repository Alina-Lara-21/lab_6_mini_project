#include <stdio.h>
#include < stdlib.h>

int main() {
    int a, b; 
    char op; 
    int result; 

    char *query = getenv("QUERY_STRING");
    if (query == NULL) {
        printf("No input recived."); 
        return 0;
    }

    sscanf(query, "a=%d&b=%d&op=%c", &a, &b, &op);

    switch (op) {
        case '+':
            result = a + b; 
            break;
        case '-':
            result = a - b; 
            break;
        case '*':
            result = a * b; 
            break;
        case '/':
            if (b == 0) {
                printf("Division by zero is not allowed."); 
                return 0;
            }
            result = a / b; 
            break;
        default:
            printf("Invalid operator."); 
            return 0;
    }
    return 0;
}