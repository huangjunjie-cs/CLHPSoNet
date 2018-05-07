The code is implemented using theano.

f = open('/home/suhang/data/lisa/data/epinions/code/epinions_large.p') is the code for reading the training data. If I remember correct, the training data is of the format vi, vj, vk where (vi, vj) = 1 and (vi,vk) = -1. 


The code used to get the embedding from the model after it is trained:
def convert_to_mat(filename):
    para = pickle.load(open('/home/suhang/data/lisa/data/epinions/res_large_20_1/1000.p','rb'))
    emb = np.asarray(para[0].get_value())
    W1 = np.asarray(para[1].get_value())
    W2 = np.asarray(para[2].get_value())
    b = np.asarray(para[3].get_value())
    emb1 = np.tanh(np.dot(emb,W1)+b)
    emb2 = np.tanh(np.dot(emb,W2)+b)

    scipy.io.savemat(filename, {'emb':emb, 'emb1':emb1, 'emb2':emb2})

Note that emb[0] is the vector representation for virtual node.

For any question, please contact swang187@asu.edu

