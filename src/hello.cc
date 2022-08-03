#include <iostream>
#include <nan.h>

using namespace v8;

NAN_METHOD(hello) {
    int num;
    for(int i=0; i<150000;i++){
        num++;
    }
}

NAN_MODULE_INIT(init) {
    Nan::SetMethod(target, "hello", hello);
}

NODE_MODULE(hello, init);