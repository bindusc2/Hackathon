a = int(input("a "))
b = int(input("b "))
while b != 0:
    temp = b
    b = a%b
    a = temp
print(a)






