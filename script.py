a = int(input("a "))
b = int(input("b "))
n = int(input("Enter the number of terms:"))
for i in range(n):
    print(a)
    temp = a+b
    a = b
    b = temp

